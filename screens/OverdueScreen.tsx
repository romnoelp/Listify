import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Entypo } from '@expo/vector-icons';

interface Task {
  id: number;
  title: string;
  status: string;
}

const OverdueScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Complete homework", status: "On Going" },
    { id: 4, title: "Bebetaym", status: "On Going"}
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
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Overdue</Text>
      <FlatList
        data={tasks.filter(task => task.status === "Overdue")}
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
    width: wp(3),
    height: wp(3),
    borderRadius: wp(2.5),
    borderWidth: 2,
    marginRight: wp(3),
  },
  checkboxCompleted: {
    backgroundColor: "black",
    borderColor: "black",
  },
  checkboxOverdue: {
    backgroundColor: "transparent",
    borderColor: "red",
  },
  checkboxDefault: {
    backgroundColor: "transparent",
    borderColor: "#000",
  },
  taskText: {
    fontFamily: "kodchasan-regular",
    fontSize: wp(4),
    flex: 1,
  },
  
});

export default OverdueScreen;
