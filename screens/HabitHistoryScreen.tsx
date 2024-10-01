import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

interface Habit {
  name: string;
  streak: number;
  history: string[];
  lastCompletedDate: string | null;
}

const HistoryScreen = () => {
  const [completedHabits, setCompletedHabits] = useState<Habit[]>([]);
  const navigation = useNavigation();

  // Load habit data from AsyncStorage and filter out completed habits
  const loadCompletedHabits = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem('@habits');
      if (storedHabits !== null) {
        const habits: Habit[] = JSON.parse(storedHabits);
        const filteredHabits = habits.filter(habit => habit.streak > 0); // Only completed habits
        setCompletedHabits(filteredHabits);
      }
    } catch (error) {
      console.error('Failed to load habits', error);
    }
  };

  useEffect(() => {
    loadCompletedHabits();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {completedHabits.length > 0 ? (
        <FlatList
          data={completedHabits}
          keyExtractor={item => item.name}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('HabitHistoryScreen', {habit: item})
              }>
              <Text style={styles.habitItem}>{item.name}</Text>
              <Text>Current Streak: {item.streak} days</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>No completed habits yet.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  habitItem: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;
