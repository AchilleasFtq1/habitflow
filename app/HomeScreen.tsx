import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, TextInput, Title } from "react-native-paper";
import HabitCard from "../components/HabitCard";

interface Habit {
  name: string;
  streak: number;
  category: string;
  reminderFrequency: string;
  reminderTime: Date | null;
  history: string[];
}

interface ProgressData {
  day: string; // Date string in the format 'YYYY-MM-DD'
  habitsCompleted: number;
}

const HomeScreen = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitName, setHabitName] = useState("");
  const [habitCategory, setHabitCategory] = useState<string | null>(null);
  const [reminderFrequency, setReminderFrequency] = useState<string | null>(
    null
  );
  const [reminderTime, setReminderTime] = useState<Date | null>(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const navigation = useNavigation<NavigationProp<any>>();

  // Load habits from AsyncStorage
  const loadHabits = async () => {
    try {
      const savedHabits = await AsyncStorage.getItem("@habits");
      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      }
    } catch (e) {
      Alert.alert("Error", "Failed to load habits");
    }
  };

  // Save habits to AsyncStorage
  const saveHabits = async (newHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem("@habits", JSON.stringify(newHabits));
    } catch (e) {
      Alert.alert("Error", "Failed to save habits");
    }
  };

  // Load progress data from AsyncStorage
  const loadProgressData = async (): Promise<ProgressData[]> => {
    try {
      const savedProgress = await AsyncStorage.getItem("@progress_data");
      return savedProgress ? JSON.parse(savedProgress) : [];
    } catch (e) {
      console.error("Error loading progress data", e);
      return [];
    }
  };

  // Save progress data to AsyncStorage
  const saveProgressData = async (newProgress: ProgressData[]) => {
    try {
      await AsyncStorage.setItem("@progress_data", JSON.stringify(newProgress));
    } catch (e) {
      Alert.alert("Error", "Failed to save progress data");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  // Add a new habit
  const addHabit = () => {
    if (!habitName) {
      Alert.alert("Error", "Please enter a habit name");
      return;
    }
    if (!habitCategory || habitCategory === "Select Category") {
      Alert.alert("Error", "Please select a category");
      return;
    }
    if (!reminderFrequency || reminderFrequency === "Select Frequency") {
      Alert.alert("Error", "Please select a reminder frequency");
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
    setHabitName("");
    setHabitCategory(null);
    setReminderFrequency(null);
  };

  // Complete a habit and update progress
  const completeHabit = async (habit: Habit) => {
    const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
    let updatedProgress = await loadProgressData();

    // Check if progress data for today exists
    const todayProgress = updatedProgress.find((p) => p.day === today);
    if (todayProgress) {
      todayProgress.habitsCompleted += 1;
    } else {
      updatedProgress.push({ day: today, habitsCompleted: 1 });
    }

    // Save the updated progress
    await saveProgressData(updatedProgress);

    // Update the habits
    const updatedHabits = habits.map((h) => {
      if (h.name === habit.name) {
        h.streak += 1;
        h.history.push(today); // Add today's date to the history
      }
      return h;
    });

    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };

  // Handle time picker for native
  const handleTimePickerChange = (
    event: unknown,
    selectedDate?: Date | undefined
  ) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setReminderTime(selectedDate);
    }
  };

  // Handle time picker for web
  const handleTimePickerChangeWeb = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedTime = event.target.value;
    if (selectedTime) {
      const [hours, minutes] = selectedTime.split(":");
      const newDate = new Date();
      newDate.setHours(parseInt(hours, 10));
      newDate.setMinutes(parseInt(minutes, 10));
      setReminderTime(newDate);
    }
  };

  // Render time picker based on platform
  const renderTimePicker = () => {
    if (Platform.OS === "web") {
      return (
        <input
          type="time"
          value={
            reminderTime ? reminderTime.toISOString().substring(11, 16) : ""
          }
          onChange={handleTimePickerChangeWeb}
          style={styles.timeInput}
        />
      );
    }

    return (
      <>
        <Button
          mode="outlined"
          onPress={() => setShowTimePicker(true)}
          style={styles.addButton}
        >
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
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Title style={styles.title}>Your Habits</Title>

        {habits.length > 0 ? (
          habits.slice(-2).map((habit, index) => (
            <View key={index}>
              <HabitCard
                habit={habit}
                onComplete={() => completeHabit(habit)}
                onDelete={() => {
                  const updatedHabits = habits.filter(
                    (h) => h.name !== habit.name
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

        <Button
          mode="contained"
          onPress={() => setModalVisible(true)}
          style={styles.button}
        >
          Add New Habit
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate("CurrentHabitsScreen")}
          style={styles.button}
        >
          View Active Habits
        </Button>

        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                label="Habit Name"
                value={habitName}
                onChangeText={setHabitName}
                mode="outlined"
                style={styles.input}
              />

              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={habitCategory}
                  onValueChange={(itemValue) => setHabitCategory(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Category" value={null} />
                  <Picker.Item label="Health" value="Health" />
                  <Picker.Item label="Work" value="Work" />
                  <Picker.Item
                    label="Personal Growth"
                    value="Personal Growth"
                  />
                </Picker>
              </View>

              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={reminderFrequency}
                  onValueChange={(itemValue) => setReminderFrequency(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Frequency" value={null} />
                  <Picker.Item label="Daily" value="daily" />
                  <Picker.Item label="Weekly" value="weekly" />
                  <Picker.Item label="Monthly" value="monthly" />
                </Picker>
              </View>

              {renderTimePicker()}

              <Button
                mode="contained"
                onPress={addHabit}
                style={styles.addButton}
              >
                Add Habit
              </Button>

              <Button
                mode="contained"
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                Close
              </Button>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
    color: "#4a90e2",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  timeInput: {
    marginVertical: 10,
    height: 40,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    marginVertical: 10,
    backgroundColor: "#4a90e2",
  },
  addButton: {
    marginVertical: 10,
    backgroundColor: "#4a90e2",
  },
  closeButton: {
    marginVertical: 10,
    backgroundColor: "#ccc",
  },
  input: {
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default HomeScreen;
