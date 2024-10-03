import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams, ThemeProvider } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";
import { Dimensions, Image } from "react-native";
import CurrentHabitsScreen from "../../app/CurrentHabitsScreen";
import HabitDetailScreen from "../../app/HabitDetailScreen";
import HistoryScreen from "../../app/HistoryScreen";
import HomeScreen from "../../app/HomeScreen";
import ProgressScreen from "../../app/ProgressScreen";
import SettingsScreen from "../../app/SettingsScreen";
import { darkTheme, lightTheme } from "../../themes";

// Define types for the Tab Navigator
export type TabParamList = {
  Home: undefined;
  Progress: undefined;
  History: undefined;
  Settings: undefined;
};

// Define types for the Stack Navigator
export type RootStackParamList = {
  HomeScreen: undefined;
  CurrentHabitsScreen: undefined;
  HabitDetailScreen: { habit: Habit };
  HistoryScreen: undefined;
  ProgressScreen: undefined;
  SettingsScreen: undefined;
  Tabs: NavigatorScreenParams<TabParamList>;
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
const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Preload icons for better performance
const icons = {
  Home: require("../../assets/icons/home.png"),
  Progress: require("../../assets/icons/progress.png"),
  History: require("../../assets/icons/history.png"),
  Settings: require("../../assets/icons/setting.png"),
};

// Stack Navigator for each tab screen
const HomeNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ title: "Home" }}
    />
    <Stack.Screen
      name="HabitDetailScreen"
      component={HabitDetailScreen}
      options={{ title: "Habit Details" }}
    />
    <Stack.Screen
      name="CurrentHabitsScreen"
      component={CurrentHabitsScreen}
      options={{ title: "Current Habits" }}
    />
  </Stack.Navigator>
);

const ProgressNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProgressScreen"
      component={ProgressScreen}
      options={{ title: "Progress" }}
    />
  </Stack.Navigator>
);

const HistoryNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HistoryScreen"
      component={HistoryScreen}
      options={{ title: "History" }}
    />
  </Stack.Navigator>
);

const SettingsNavigator = ({
  isDarkMode,
  setIsDarkMode,
}: TabNavigatorProps) => (
  <Stack.Navigator>
    <Stack.Screen name="SettingsScreen" options={{ title: "Settings" }}>
      {() => (
        <SettingsScreen isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      )}
    </Stack.Screen>
  </Stack.Navigator>
);

// Tab Navigator using images as icons
const TabNavigator: React.FC<TabNavigatorProps> = ({
  isDarkMode,
  setIsDarkMode,
}) => {
  const getTabBarIcon = (route: keyof TabParamList) => {
    const iconSource = icons[route];

    const iconSize = Dimensions.get("window").width > 350 ? 28 : 24;

    return (
      <Image
        source={iconSource}
        style={{ width: iconSize, height: iconSize }}
      />
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: () => getTabBarIcon(route.name as keyof TabParamList),
        tabBarActiveTintColor: "#4a90e2",
        tabBarInactiveTintColor: "gray",
        headerShown: false, // Disable the header at the TabNavigator level
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Progress" component={ProgressNavigator} />
      <Tab.Screen name="History" component={HistoryNavigator} />
      <Tab.Screen
        name="Settings"
        children={() => (
          <SettingsNavigator
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        )}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider value={theme}>
      <TabNavigator isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </ThemeProvider>
  );
};

export default AppNavigator;
