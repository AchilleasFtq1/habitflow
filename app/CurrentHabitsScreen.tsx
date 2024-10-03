import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button, Card, Title } from "react-native-paper";
import { RootStackParamList } from "../components/navigation/AppNavigator"; // Import the Habit interface

interface Habit {
  name: string;
  streak: number;
  history: string[];
  lastCompletedDate: string | null;
}

const CurrentHabitsScreen = () => {
  const [activeHabits, setActiveHabits] = useState<Habit[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Correctly typed navigation

  // Load active habit data from AsyncStorage (habits without a streak or completion history)
  const loadActiveHabits = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem("@habits");
      if (storedHabits !== null) {
        const habits: Habit[] = JSON.parse(storedHabits);
        const filteredHabits = habits.filter((habit) => habit.streak === 0); // Active habits with no completion
        setActiveHabits(filteredHabits);
      }
    } catch (error) {
      console.error("Failed to load habits", error);
    }
  };

  useEffect(() => {
    loadActiveHabits();
  }, []);

  // Function to delete a habit
  const deleteHabit = async (habitName: string) => {
    const updatedHabits = activeHabits.filter(
      (habit) => habit.name !== habitName
    );
    setActiveHabits(updatedHabits);

    try {
      // Load all habits and update the list
      const storedHabits = await AsyncStorage.getItem("@habits");
      if (storedHabits !== null) {
        const allHabits: Habit[] = JSON.parse(storedHabits);
        const updatedAllHabits = allHabits.filter(
          (habit) => habit.name !== habitName
        );

        // Save the updated list back to AsyncStorage
        await AsyncStorage.setItem("@habits", JSON.stringify(updatedAllHabits));
      }
    } catch (error) {
      console.error("Failed to delete habit:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>Active Habits</Title>

      {activeHabits.length > 0 ? (
        <FlatList
          data={activeHabits}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.habitRow}>
                  <Text style={styles.habitName}>{item.name}</Text>
                  <Text style={styles.streak}>Streak: {item.streak} days</Text>
                </View>

                <View style={styles.buttonRow}>
                  <Button
                    mode="contained"
                    onPress={() =>
                      navigation.navigate("HabitDetailScreen", { habit: item })
                    }
                    style={styles.detailButton}
                  >
                    View Details
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => deleteHabit(item.name)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </Button>
                </View>
              </Card.Content>
            </Card>
          )}
        />
      ) : (
        <Text style={styles.emptyMessage}>No active habits yet.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a90e2",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  habitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  habitName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  streak: {
    fontSize: 16,
    color: "#888",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  detailButton: {
    backgroundColor: "#4a90e2",
    padding: 5,
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    padding: 5,
  },
  emptyMessage: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 20,
  },
});

export default CurrentHabitsScreen;
