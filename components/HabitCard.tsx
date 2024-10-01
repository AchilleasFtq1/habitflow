import React from 'react';
import {Button, Card, Paragraph, Title} from 'react-native-paper';

interface Habit {
  name: string;
  streak: number;
}

interface HabitCardProps {
  habit: Habit;
  onComplete: () => void; // Add onComplete prop to the interface
}

export default function HabitCard({habit, onComplete}: HabitCardProps) {
  // Include onComplete in props
  return (
    <Card>
      <Card.Content>
        <Title>{habit.name}</Title>
        <Paragraph>Current Streak: {habit.streak} days</Paragraph>
        <Button onPress={onComplete}>Complete Habit</Button>{' '}
        {/* Call onComplete when pressed */}
      </Card.Content>
    </Card>
  );
}
