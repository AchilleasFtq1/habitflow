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

const CurrentHabitsScreen = () => {
  const [activeHabits, setActiveHabits] = useState<Habit[]>([]);
  const navigation = useNavigation();

  // Load active habit data from AsyncStorage (habits without a streak or completion history)
  const loadActiveHabits = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem('@habits');
      if (storedHabits !== null) {
        const habits: Habit[] = JSON.parse(storedHabits);
        const filteredHabits = habits.filter(habit => habit.streak === 0); // Active habits with no completion
        setActiveHabits(filteredHabits);
      }
    } catch (error) {
      console.error('Failed to load habits', error);
    }
  };

  useEffect(() => {
    loadActiveHabits();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {activeHabits.length > 0 ? (
        <FlatList
          data={activeHabits}
          keyExtractor={item => item.name}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('HabitDetailScreen', {habit: item})
              }>
              <Text style={styles.habitItem}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>No active habits yet.</Text>
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

export default CurrentHabitsScreen;
