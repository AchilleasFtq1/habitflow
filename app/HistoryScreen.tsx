import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';

interface Habit {
  name: string;
  streak: number;
  history: string[]; // This is assumed to always be an array
}

export default function HistoryScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load habit data from AsyncStorage
  const loadHabits = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem('@habits');
      if (storedHabits !== null) {
        const parsedHabits = JSON.parse(storedHabits);

        // Ensure that `history` is always an array
        const sanitizedHabits = parsedHabits.map((habit: Habit) => ({
          ...habit,
          history: Array.isArray(habit.history) ? habit.history : [],
        }));

        setHabits(sanitizedHabits);
      }
    } catch (error) {
      console.error('Failed to load habit data:', error);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {habits.length > 0 ? (
        <FlatList
          data={habits}
          keyExtractor={item => item.name}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.streak}>
                Current Streak: {item.streak} days
              </Text>
              <Text style={styles.historyTitle}>Completion History:</Text>
              {item.history.length > 0 ? (
                item.history.map((date, index) => (
                  <Text key={index} style={styles.historyItem}>
                    {date}
                  </Text>
                ))
              ) : (
                <Text style={styles.noHistory}>No history available yet.</Text>
              )}
            </View>
          )}
        />
      ) : (
        <Text style={styles.noHabits}>No habit history available.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  streak: {
    fontSize: 16,
    color: '#4a90e2',
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginTop: 10,
    marginBottom: 5,
  },
  historyItem: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  noHistory: {
    fontSize: 14,
    color: '#999',
  },
  noHabits: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});
