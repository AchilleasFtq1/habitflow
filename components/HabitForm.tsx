import React, {useState} from 'react';
import {Button, TextInput} from 'react-native-paper';

interface HabitFormProps {
  onSubmit: (name: string) => void;
}

export default function HabitForm({onSubmit}: HabitFormProps) {
  const [habitName, setHabitName] = useState('');

  const handleSubmit = () => {
    if (habitName.trim()) {
      onSubmit(habitName);
      setHabitName('');
    }
  };

  return (
    <>
      <TextInput
        label="Habit Name"
        value={habitName}
        onChangeText={setHabitName}
        mode="outlined"
        style={{marginBottom: 10}}
      />
      <Button mode="contained" onPress={handleSubmit}>
        Add Habit
      </Button>
    </>
  );
}
