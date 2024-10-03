import React, {useState} from 'react';
import {TextInput} from 'react-native-paper';

interface HabitFormProps {
  onChange: (name: string) => void;
}

export default function HabitForm({onChange}: HabitFormProps) {
  const [habitName, setHabitName] = useState('');

  const handleNameChange = (name: string) => {
    setHabitName(name);
    onChange(name.trim());
  };

  return (
    <TextInput
      label="Habit Name"
      value={habitName}
      onChangeText={handleNameChange}
      mode="outlined"
      style={{marginBottom: 10}}
    />
  );
}
