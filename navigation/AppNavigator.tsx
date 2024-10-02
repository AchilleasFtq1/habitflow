import {MaterialIcons} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useState} from 'react';
import CurrentHabitsScreen from '../screens/CurrentHabitsScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HomeScreen from '../screens/HomeScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {darkTheme, lightTheme} from '../themes';

// Define the types for the Stack Navigator
export type RootStackParamList = {
  HomeScreen: undefined;
  CurrentHabitsScreen: undefined; // No params are passed here
  HabitDetailScreen: {habit: Habit}; // Ensure this is correctly defined
  Tabs: NavigatorScreenParams<any>;
};
// Define Habit interface
export interface Habit {
  name: string;
  streak: number;
  history: string[];
  lastCompletedDate: string | null;
}

// Define a type for the TabNavigator props
interface TabNavigatorProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

// Create Tab and Stack navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>(); // Attach the RootStackParamList type

// Tab Navigator for visible tabs (moved outside of render function)
const TabNavigator: React.FC<TabNavigatorProps> = ({
  isDarkMode,
  setIsDarkMode,
}) => {
  const getTabBarIcon = (route: any, color: string, size: number) => {
    let iconName: keyof typeof MaterialIcons.glyphMap;

    switch (route.name) {
      case 'Home':
        iconName = 'home';
        break;
      case 'Progress':
        iconName = 'show-chart';
        break;
      case 'History':
        iconName = 'history';
        break;
      case 'Settings':
        iconName = 'settings';
        break;
      default:
        iconName = 'home'; // Fallback
    }

    return <MaterialIcons name={iconName} size={size} color={color} />;
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => getTabBarIcon(route, color, size),
        tabBarActiveTintColor: '#4a90e2',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen
        name="Settings"
        children={() => (
          <SettingsScreen
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        )}
      />
    </Tab.Navigator>
  );
};

// Main App Stack Navigator wrapping the Tab navigator
const AppNavigator: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator>
        {/* Pass TabNavigator directly as the component prop */}
        <Stack.Screen
          name="Tabs"
          options={{headerShown: false}} // Hide the header for the tabs
        >
          {() => (
            <TabNavigator
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}
        </Stack.Screen>
        {/* Add hidden screens here */}
        <Stack.Screen
          name="HabitDetailScreen"
          component={HabitDetailScreen}
          options={{title: 'Habit Details'}}
        />
        <Stack.Screen
          name="CurrentHabitsScreen"
          component={CurrentHabitsScreen}
          options={{title: 'Current Habits'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
