import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Entypo } from '@expo/vector-icons';
import FloatingButton from "../components/FloatingButton";

interface Task {
  id: number;
  title: string;
  status: string;
}

const TaskScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Complete homework", status: "On Going" },
    { id: 2, title: "Go for a run", status: "Overdue" },
    { id: 3, title: "Buy groceries", status: "Completed" },
  ]);


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
  const handleToggleTaskStatus = (id: number) => {

  }
  const handleDeleteTask= (id: number) => {

  }

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskContainer}>
    <TouchableOpacity onPress={() => handleToggleTaskStatus(item.id)}>
      {item.status === "Completed" ? (
        <View style={[styles.checkbox, styles.checkboxCompleted]} />
      ) : item.status === "Overdue" ? (
        <View style={[styles.checkbox, styles.checkboxOverdue]} />
      ) : (
        <View style={[styles.checkbox, styles.checkboxDefault]} />
      )}
    </TouchableOpacity>
    <Text style={styles.taskText}>{item.title}</Text>
    <TouchableOpacity onPress={() => handleDeleteTask(item.id)}  style ={[styles.trashIcon]}>
      <Entypo name="trash" size={24} color="black" />
    </TouchableOpacity>
  </View>
);

  return (
    <View style={styles.mainContainer}>
      {groupedTasks["On Going"] && (
        <View >
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
        <View>
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
        <View>
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
      <View style={styles.floatingButtonContainer}>
        <FloatingButton
          onAddItemsPress={() => {
            // Add your logic here for adding tasks
          }}
          onDeleteAllItemsPress={() => {
            // Add your logic here for deleting all tasks
          }}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: wp(5),
  },
  headerText: {
    fontFamily: "kodchasan-bold",
    fontSize: wp(6.5),
    color: "#414042",
    marginBottom: hp(0.5),
  },
  tasksContainer: {
    marginBottom: hp(5),
    
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
  },

  taskText: {
    fontFamily: "kodchasan-regular",
    fontSize: wp(5),
    flex: 1,
  },
  headerUnderline: {
    borderBottomColor: "#414042",
    borderBottomWidth: wp(0.2),
    width: "97%",
    marginTop: wp(1),
    marginLeft: wp(2),
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  checkbox: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    borderWidth: 2,
    marginRight: wp(3),
  },
  checkboxCompleted: {
    backgroundColor: "black", // Green color for completed tasks
    borderColor: "black", // Green border color for completed tasks
  },
  checkboxOverdue: {
    backgroundColor: "#D20062", // Red color for overdue tasks
    borderColor: "#D20062", // Red border color for overdue tasks
  },
  checkboxDefault: {
    backgroundColor: "transparent", // Transparent background for default tasks
    borderColor: "#000", // Black border color for default tasks
  },
  trashIcon: {
    fontSize: wp(5),
    marginBottom: hp(0.8),
    marginLeft: "auto",
  },
});

export default TaskScreen;
