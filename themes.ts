import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {MD3DarkTheme, MD3LightTheme} from 'react-native-paper';

export const lightTheme = {
  ...NavigationDefaultTheme, // Start with React Navigation's default theme
  ...MD3LightTheme, // Merge Material Design 3 light theme
  colors: {
    ...NavigationDefaultTheme.colors, // Include navigation theme colors
    ...MD3LightTheme.colors, // Include material design colors
    primary: '#4a90e2',
    background: '#ffffff',
    text: '#000000',
  },
};

export const darkTheme = {
  ...NavigationDarkTheme, // Start with React Navigation's dark theme
  ...MD3DarkTheme, // Merge Material Design 3 dark theme
  colors: {
    ...NavigationDarkTheme.colors, // Include navigation theme colors
    ...MD3DarkTheme.colors, // Include material design colors
    primary: '#4a90e2',
    background: '#000000',
    text: '#ffffff',
  },
};
