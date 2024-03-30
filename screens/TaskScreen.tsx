import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface Task {
  id: number;
  title: string;
  status: string;
}

const TaskScreen = () => {
  // Sample tasks data for testing
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Complete homework", status: "On Going" },
    { id: 2, title: "Go for a run", status: "Overdue" },
    { id: 3, title: "Buy groceries", status: "Completed" },
  ]);

  // Group tasks by status
  const groupedTasks: { [key: string]: Task[] } = tasks.reduce(
    (acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    },
    {} as { [key: string]: Task[] }
  );

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.bulletPoint}>•</Text>
      <Text style={styles.taskText}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      {groupedTasks["On Going"] && (
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>On Going</Text>
        </View>
      )}
      {groupedTasks["On Going"] && (
        <FlatList
          data={groupedTasks["On Going"]}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.tasksContainer}
        />
      )}
      <View style={styles.headerUnderline}></View>
      {groupedTasks["Overdue"] && (
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Overdue</Text>
        </View>
      )}
      {groupedTasks["Overdue"] && (
        <FlatList
          data={groupedTasks["Overdue"]}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.tasksContainer}
        />
      )}
      {groupedTasks["Overdue"] && (
        <View style={styles.headerUnderline}></View>
      )}
      {groupedTasks["Completed"] && (
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Completed</Text>
        </View>
      )}
      {groupedTasks["Completed"] && (
        <FlatList
          data={groupedTasks["Completed"]}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.tasksContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    alignSelf: "flex-start",
    justifyContent: "flex-start",
  },
  headerText: {
    fontFamily: "kodchasan-bold",
    fontSize: wp(6.5),
    color: "#414042",
    alignSelf: "flex-start",
    marginLeft: wp(5),
  },
  tasksContainer: {
    marginLeft: wp(5),
    marginBottom: hp(5),
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bulletPoint: {
    fontSize: wp(8),
    marginRight: wp(2),
  },
  taskText: {
    marginBottom: 5,
    fontFamily: "kodchasan-regular",
    fontSize: wp(5),
  },
  headerUnderline: {
    borderBottomColor: "#414042",
    borderBottomWidth: wp(0.2),
    width: "97%",
    marginTop: wp(1),
    marginLeft: wp(2),
  },
});

export default TaskScreen;
