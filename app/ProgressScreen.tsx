import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function ProgressScreen() {
  const [progressData, setProgressData] = useState<
    {day: number; habitsCompleted: number}[]
  >([]);

  // Function to save progress data to AsyncStorage
  const saveProgressData = async (
    data: {day: number; habitsCompleted: number}[],
  ) => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem('@progress_data', jsonValue);
      console.log('Progress data saved successfully!');
    } catch (e) {
      console.error('Error saving progress data', e);
    }
  };

  // Function to load progress data from AsyncStorage
  const loadProgressData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@progress_data');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error loading progress data', e);
      return []; // Fallback to empty data in case of an error
    }
  };

  // Use focus effect to load progress data every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const savedData = await loadProgressData();
        setProgressData(savedData);
      };
      loadData();
    }, []),
  );

  // Prepare data for the LineChart
  const chartData = {
    labels:
      progressData.length > 0
        ? progressData.map(d => `Day ${d.day}`)
        : ['No data'],
    datasets: [
      {
        data:
          progressData.length > 0
            ? progressData.map(d => d.habitsCompleted)
            : [0],
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      {progressData.length > 0 ? (
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={screenWidth * 0.9} // Adjust width to be responsive
            height={220}
            chartConfig={{
              backgroundColor: '#4a90e2', // Use primary blue color
              backgroundGradientFrom: '#4a90e2',
              backgroundGradientTo: '#4a90e2',
              decimalPlaces: 0, // Set to 0 for whole numbers of completed habits
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: styles.chartStyle,
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffffff', // White dots
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      ) : (
        <Text>No progress data available yet.</Text>
      )}
      <Button
        title="Save Progress"
        onPress={() => saveProgressData(progressData)}
        color="#4a90e2" // Use primary color for the button
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5', // Light gray background
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center', // Align the chart horizontally
    padding: 20,
  },
  chartStyle: {
    borderRadius: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
