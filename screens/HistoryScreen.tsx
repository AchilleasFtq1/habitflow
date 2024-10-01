import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';

interface Habit {
  name: string;
  streak: number;
  history: string[];
}

export default function HistoryScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load habit data from AsyncStorage
  const loadHabits = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem('@habits');
      if (storedHabits !== null) {
        setHabits(JSON.parse(storedHabits));
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
              <Text>Current Streak: {item.streak} days</Text>
              <Text style={styles.historyTitle}>Completion History:</Text>
              {item.history.map((date, index) => (
                <Text key={index} style={styles.historyItem}>
                  {date}
                </Text>
              ))}
            </View>
          )}
        />
      ) : (
        <Text>No habit history available.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  historyItem: {
    fontSize: 14,
    marginVertical: 2,
  },
});
