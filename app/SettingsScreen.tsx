import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Switch} from 'react-native-paper';

interface SettingsScreenProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export default function SettingsScreen({
  isDarkMode,
  setIsDarkMode,
}: SettingsScreenProps) {
  // Function to save dark mode setting to AsyncStorage
  const saveDarkModeSetting = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('@app_dark_mode', JSON.stringify(value));
    } catch (e) {
      console.error('Failed to save dark mode setting', e);
    }
  };

  // Effect to load the dark mode setting from AsyncStorage when screen loads
  useEffect(() => {
    const loadDarkModeSetting = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem('@app_dark_mode');
        if (savedDarkMode !== null) {
          setIsDarkMode(JSON.parse(savedDarkMode));
        }
      } catch (e) {
        console.error('Failed to load dark mode setting', e);
        setIsDarkMode(false); // Default to light mode in case of error
      }
    };
    loadDarkModeSetting();
  }, [setIsDarkMode]);

  // Toggle dark mode and save the setting
  const toggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    saveDarkModeSetting(newValue); // Save the dark mode setting after toggling
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        isDarkMode ? styles.darkBackground : styles.lightBackground,
      ]}>
      <View style={styles.settingItem}>
        <Text
          style={[
            styles.label,
            isDarkMode ? styles.darkText : styles.lightText,
          ]}>
          Dark Mode
        </Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
  },
  lightBackground: {
    backgroundColor: '#f5f5f5',
  },
  darkBackground: {
    backgroundColor: '#1c1c1c',
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#ffffff',
  },
});
