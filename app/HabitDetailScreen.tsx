import { RouteProp } from "@react-navigation/native";
import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button, Card, ProgressBar, Title } from "react-native-paper";
import { Habit } from "../components/navigation/AppNavigator"; // Import the Habit interface

// Define route prop for HabitDetailScreen
type HabitDetailScreenRouteProp = RouteProp<
  { HabitDetailScreen: { habit: Habit } },
  "HabitDetailScreen"
>;

interface HabitDetailScreenProps {
  route: HabitDetailScreenRouteProp; // Expect route prop with habit
}

export default function HabitDetailScreen({ route }: HabitDetailScreenProps) {
  const { habit } = route.params;

  if (!habit) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No habit details available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Details for: {habit.name}</Title>
          <Text>Current Streak: {habit.streak} days</Text>
          <Text>Last Completed: {habit.lastCompletedDate || "Never"}</Text>

          <View style={styles.progressContainer}>
            <Text>Progress:</Text>
            <ProgressBar
              progress={habit.streak / 30}
              color="#4a90e2"
              style={styles.progressBar}
            />
          </View>

          <Text style={styles.historyTitle}>Completion History:</Text>
          <FlatList
            data={habit.history}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.historyItem}>- {item}</Text>
            )}
            style={styles.historyList}
          />
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => console.log("Mark Habit Completed")}
        style={styles.button}
      >
        Complete Habit
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a90e2",
    marginBottom: 10,
  },
  progressContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  historyTitle: {
    marginTop: 20,
    fontWeight: "bold",
  },
  historyItem: {
    fontSize: 14,
    marginBottom: 5,
  },
  historyList: {
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#4a90e2",
  },
});
