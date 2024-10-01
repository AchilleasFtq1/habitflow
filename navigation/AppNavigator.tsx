import {MaterialIcons} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React, {useState} from 'react';
import HistoryScreen from '../screens/HistoryScreen'; // Import HistoryScreen
import HomeScreen from '../screens/HomeScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {darkTheme, lightTheme} from '../themes';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const getTabBarIcon = (route: any, color: string, size: number) => {
    let iconName: keyof typeof MaterialIcons.glyphMap;

    switch (route.name) {
      case 'Home':
        iconName = 'home';
        break;
      case 'Progress':
        iconName = 'show-chart';
        break;
      case 'History': // Add history icon
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
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => getTabBarIcon(route, color, size),
          tabBarActiveTintColor: '#4a90e2',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Progress" component={ProgressScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />{' '}
        {/* Add History Tab */}
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
    </NavigationContainer>
  );
};

export default AppNavigator;
