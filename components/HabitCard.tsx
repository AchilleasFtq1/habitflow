import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Card, Text} from 'react-native-paper';

interface Habit {
  name: string;
  streak: number;
  reminderFrequency: string;
  reminderTime: Date | null;
}

interface HabitCardProps {
  habit: Habit;
  onComplete: () => void;
  onDelete: () => void;
}

export default function HabitCard({
  habit,
  onComplete,
  onDelete,
}: HabitCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.habitName}>{habit.name}</Text>
        <Text>Streak: {habit.streak} days</Text>
        <Text>Reminder: {habit.reminderFrequency}</Text>
        <View style={styles.buttonGroup}>
          <Button
            mode="contained"
            onPress={onComplete}
            style={styles.smallButton}>
            Complete
          </Button>
          <Button
            mode="contained"
            onPress={onDelete}
            style={styles.deleteButton}>
            Delete
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  smallButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  deleteButton: {
    backgroundColor: '#ff5252',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
});
