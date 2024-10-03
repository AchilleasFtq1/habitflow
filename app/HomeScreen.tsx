import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button, TextInput, Title} from 'react-native-paper';
import HabitCard from '../components/HabitCard';

interface Habit {
  name: string;
  streak: number;
  category: string;
  reminderFrequency: string;
  reminderTime: Date | null;
  history: string[];
}

interface ProgressData {
  day: string;
  habitsCompleted: number;
}

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitName, setHabitName] = useState('');
  const [habitCategory, setHabitCategory] = useState<string | null>(null);
  const [reminderFrequency, setReminderFrequency] = useState<string | null>(
    null,
  );
  const [reminderTime, setReminderTime] = useState<Date | null>(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const navigation = useNavigation<NavigationProp<any>>();

  // Load habits from AsyncStorage
  const loadHabits = async () => {
    try {
      const savedHabits = await AsyncStorage.getItem('@habits');
      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to load habits');
    }
  };

  // Save habits to AsyncStorage
  const saveHabits = async (newHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem('@habits', JSON.stringify(newHabits));
    } catch (e) {
      Alert.alert('Error', 'Failed to save habits');
    }
  };

  // Save progress data to AsyncStorage
  const saveProgressData = async (progressData: ProgressData[]) => {
    try {
      await AsyncStorage.setItem(
        '@progress_data',
        JSON.stringify(progressData),
      );
    } catch (e) {
      Alert.alert('Error', 'Failed to save progress');
    }
  };

  // Load progress data from AsyncStorage
  const loadProgressData = async (): Promise<ProgressData[]> => {
    try {
      const savedProgress = await AsyncStorage.getItem('@progress_data');
      return savedProgress ? JSON.parse(savedProgress) : [];
    } catch (e) {
      Alert.alert('Error', 'Failed to load progress data');
      return [];
    }
  };

  // Load habits initially and on focus
  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, []),
  );

  // Add a new habit
  const addHabit = () => {
    if (!habitName) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }
    if (!habitCategory || habitCategory === 'Select Category') {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!reminderFrequency || reminderFrequency === 'Select Frequency') {
      Alert.alert('Error', 'Please select a reminder frequency');
      return;
    }

    const newHabit: Habit = {
      name: habitName,
      streak: 0,
      category: habitCategory,
      reminderFrequency: reminderFrequency,
      reminderTime,
      history: [],
    };
    const newHabits = [...habits, newHabit];
    setHabits(newHabits);
    saveHabits(newHabits);
    setModalVisible(false);
    setHabitName('');
    setHabitCategory(null);
    setReminderFrequency(null);
  };

  // Complete a habit and track progress
  const completeHabit = async (habit: Habit) => {
    const today = new Date().toLocaleDateString(); // Get today's date

    const updatedHabits = habits.map(h => {
      if (h.name === habit.name) {
        const history = h.history || [];

        if (!history.includes(today)) {
          h.streak += 1;
          history.push(today); // Add today's date to the history
          h.history = history;
        } else {
          Alert.alert(
            'Already completed',
            'You have already completed this habit today.',
          );
        }
      }
      return h;
    });

    setHabits(updatedHabits);
    saveHabits(updatedHabits);

    // Update the progress
    const progressData = await loadProgressData();
    const todayProgress = progressData.find(p => p.day === today);

    if (todayProgress) {
      todayProgress.habitsCompleted += 1; // Increment habits completed for today
    } else {
      progressData.push({day: today, habitsCompleted: 1}); // First completion today
    }

    saveProgressData(progressData);
  };

  // Show the last two habits
  const lastTwoHabits = habits.slice(-2);

  // Handle time picker changes
  const handleTimePickerChange = (
    event: unknown,
    selectedDate?: Date | undefined,
  ) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setReminderTime(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Title style={styles.title}>Your Habits</Title>

        {lastTwoHabits.length > 0 ? (
          lastTwoHabits.map((habit, index) => (
            <View key={index}>
              <HabitCard
                habit={habit}
                onComplete={() => completeHabit(habit)} // Complete Habit Functionality
                onDelete={() => {
                  const updatedHabits = habits.filter(
                    h => h.name !== habit.name,
                  );
                  setHabits(updatedHabits);
                  saveHabits(updatedHabits);
                }}
              />
            </View>
          ))
        ) : (
          <Text>No habits yet. Add a new habit to get started!</Text>
        )}

        {/* Add New Habit Button */}
        <Button
          mode="contained"
          onPress={() => setModalVisible(true)}
          style={styles.button}>
          Add New Habit
        </Button>

        {/* View Active Habits Button */}
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CurrentHabitsScreen')}
          style={styles.button}>
          View Active Habits
        </Button>

        {/* Modal for adding a new habit */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                label="Habit Name"
                value={habitName}
                onChangeText={setHabitName}
                mode="outlined"
                style={styles.input}
              />

              {/* Category Picker */}
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={habitCategory}
                  onValueChange={itemValue => setHabitCategory(itemValue)}
                  style={styles.picker}>
                  <Picker.Item label="Select Category" value={null} />
                  <Picker.Item label="Health" value="Health" />
                  <Picker.Item label="Work" value="Work" />
                  <Picker.Item
                    label="Personal Growth"
                    value="Personal Growth"
                  />
                </Picker>
              </View>

              {/* Reminder Frequency Picker */}
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={reminderFrequency}
                  onValueChange={itemValue => setReminderFrequency(itemValue)}
                  style={styles.picker}>
                  <Picker.Item label="Select Frequency" value={null} />
                  <Picker.Item label="Daily" value="daily" />
                  <Picker.Item label="Weekly" value="weekly" />
                  <Picker.Item label="Monthly" value="monthly" />
                </Picker>
              </View>

              {/* Time Picker Button */}
              <Button
                mode="outlined"
                onPress={() => setShowTimePicker(true)}
                style={styles.addButton}>
                Set Reminder Time
              </Button>

              {showTimePicker && (
                <DateTimePicker
                  value={reminderTime || new Date()}
                  mode="time"
                  display="default"
                  onChange={handleTimePickerChange}
                />
              )}

              {/* Add and Close Buttons */}
              <Button
                mode="contained"
                onPress={addHabit}
                style={styles.addButton}>
                Add Habit
              </Button>
              <Button
                mode="contained"
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}>
                Close
              </Button>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
    color: '#4a90e2',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#4a90e2',
  },
  addButton: {
    marginVertical: 10,
    backgroundColor: '#4a90e2',
  },
  closeButton: {
    marginVertical: 10,
    backgroundColor: '#ccc',
  },
  input: {
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
