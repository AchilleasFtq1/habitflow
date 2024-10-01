import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button, TextInput, Title} from 'react-native-paper';
import HabitCard from '../components/HabitCard';
import HabitForm from '../components/HabitForm';

interface Habit {
  name: string;
  streak: number;
  category: string;
  reminderFrequency: string;
  customInterval?: number;
  reminderTime: Date | null;
  history: string[];
}

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completed, setCompleted] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [habitCategory, setHabitCategory] = useState('Health');
  const [reminderFrequency, setReminderFrequency] = useState('daily');
  const [customInterval, setCustomInterval] = useState(3);
  const navigation = useNavigation();

  // Load habits from AsyncStorage when the screen is first loaded
  useEffect(() => {
    const loadHabits = async () => {
      try {
        const savedHabits = await AsyncStorage.getItem('@habits');
        if (savedHabits !== null) {
          setHabits(JSON.parse(savedHabits));
        }
      } catch (e) {
        console.error('Failed to load habits', e);
        Alert.alert('Error', 'Failed to load habits');
      }
    };
    loadHabits();
  }, []);

  // Save habits to AsyncStorage whenever a new habit is added
  const saveHabits = async (newHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem('@habits', JSON.stringify(newHabits));
    } catch (e) {
      console.error('Failed to save habits', e);
      Alert.alert('Error', 'Failed to save habits');
    }
  };

  // Add a new habit with categories, reminders, and completion history
  const addHabit = (name: string) => {
    const newHabit = {
      name,
      streak: 0,
      category: habitCategory,
      reminderFrequency,
      customInterval:
        reminderFrequency === 'custom' ? customInterval : undefined,
      reminderTime,
      history: [],
    };
    const newHabits = [...habits, newHabit];
    setHabits(newHabits);
    saveHabits(newHabits);
  };

  const handleTimePickerChange = (event, selectedTime) => {
    setShowPicker(false);
    if (selectedTime) {
      setReminderTime(selectedTime);
    }
  };

  const completeHabit = (habit: Habit) => {
    const today = new Date().toLocaleDateString();
    const updatedHabits = habits.map(h => {
      if (h.name === habit.name) {
        if (!h.history.includes(today)) {
          h.history.push(today); // Add today's date to history
          h.streak += 1;
        }
      }
      return h;
    });
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
    setCompleted(true); // Show success animation
  };

  const scheduleNotification = async (habit: Habit) => {
    let trigger = {};
    const time = habit.reminderTime || new Date();

    if (habit.reminderFrequency === 'daily') {
      trigger = {
        hour: time.getHours(),
        minute: time.getMinutes(),
        repeats: true,
      };
    } else if (habit.reminderFrequency === 'weekly') {
      trigger = {
        weekday: 1,
        hour: time.getHours(),
        minute: time.getMinutes(),
        repeats: true,
      }; // Repeat weekly on Monday
    } else if (habit.reminderFrequency === 'custom') {
      trigger = {seconds: (habit.customInterval || 1) * 86400, repeats: true}; // Custom interval in days
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Reminder to complete your habit: ${habit.name}`,
        body: 'Stay on track and build your habit today!',
      },
      trigger,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Title style={styles.title}>Your Habits</Title>

        {habits.length > 0 ? (
          habits.map((habit, index) => (
            <View key={index}>
              <HabitCard
                habit={habit}
                onComplete={() => completeHabit(habit)}
              />
              <Button
                mode="contained"
                onPress={() => scheduleNotification(habit)}>
                Set Reminder
              </Button>
            </View>
          ))
        ) : (
          <Text>No habits yet. Add a new habit to get started!</Text>
        )}

        <HabitForm onSubmit={addHabit} />

        {/* Picker to select habit category */}
        <Picker
          selectedValue={habitCategory}
          onValueChange={itemValue => setHabitCategory(itemValue)}
          style={styles.picker}>
          <Picker.Item label="Health" value="Health" />
          <Picker.Item label="Work" value="Work" />
          <Picker.Item label="Personal Growth" value="Personal Growth" />
        </Picker>

        {/* Picker to select reminder frequency */}
        <Picker
          selectedValue={reminderFrequency}
          onValueChange={itemValue => setReminderFrequency(itemValue)}
          style={styles.picker}>
          <Picker.Item label="Daily" value="daily" />
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Custom Interval" value="custom" />
        </Picker>

        {reminderFrequency === 'custom' && (
          <TextInput
            label="Custom Interval (Days)"
            value={String(customInterval)}
            onChangeText={text => setCustomInterval(Number(text))}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
        )}

        {/* Button to show time picker */}
        <Button
          mode="contained"
          onPress={() => setShowPicker(true)}
          style={styles.button}>
          Select Reminder Time
        </Button>

        {showPicker && (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            display="default"
            onChange={handleTimePickerChange}
          />
        )}

        {completed && (
          <LottieView
            source={require('../assets/success-animation.json')}
            autoPlay
            loop={false}
            style={styles.animation}
          />
        )}

        {/* Button to navigate to CurrentHabitsScreen */}
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CurrentHabitsScreen')}
          style={styles.button}>
          View Active Habits
        </Button>
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
  picker: {
    marginVertical: 10,
  },
  button: {
    marginVertical: 20,
    backgroundColor: '#4a90e2',
  },
  input: {
    marginBottom: 20,
  },
  animation: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
});
