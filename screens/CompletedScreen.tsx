import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Entypo } from '@expo/vector-icons';

interface Task {
  id: number;
  title: string;
  status: string;
}

const CompletedScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Complete homework", status: "On Going" },
    { id: 2, title: "Go for a run", status: "Overdue" },
    { id: 3, title: "Buy groceries", status: "Completed" },
  ]);

  const handleToggleTaskStatus = (id: number) => {
    // Implement logic to change task status
  }

  const handleDeleteTask = (id: number) => {
    // Implement logic to delete task
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
      <TouchableOpacity style={styles.editIcon}>
        <Entypo name="edit" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteTask(item.id)} style={styles.trashIcon}>
        <Entypo name="trash" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>On Going</Text>
      <FlatList
        data={tasks.filter(task => task.status === "Completed")}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: wp(5),
  },
  header: {
    fontFamily: "kodchasan-bold",
    fontSize: wp(6.5),
    color: "#414042",
    marginBottom: hp(0.5),
  },
  listContainer: {
    marginBottom: hp(5),
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
  },
  checkbox: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    borderWidth: 2,
    marginRight: wp(3),
  },
  checkboxCompleted: {
    backgroundColor: "black",
    borderColor: "black",
  },
  checkboxOverdue: {
    backgroundColor: "#D20062",
    borderColor: "red",
  },
  checkboxDefault: {
    backgroundColor: "transparent",
    borderColor: "#000",
  },
  taskText: {
    fontFamily: "kodchasan-regular",
    fontSize: wp(5),
    flex: 1,
  },
  trashIcon: {
    marginLeft: "auto",
    fontSize: wp(5),
    marginBottom: hp(0.8),
  },
  editIcon: {
    marginRight: wp(4),
    marginBottom: hp(0.8),
  },
});

export default CompletedScreen;
