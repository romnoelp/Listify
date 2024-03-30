import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";

const OngoingScreen = () => {
  // Sample tasks data for testing
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete homework" },
    { id: 2, title: "Go for a run" },
    { id: 3, title: "Buy groceries" },
  ]);

  return (
    <View style={styles.mainContainer}>
      {tasks.length > 0 && (
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>On Going</Text>
        </View>
      )}
      {/* Rendering tasks in the "On Going" section */}
      <View style={styles.tasksContainer}>
        {tasks.map((task) => (
          <View style={styles.taskContainer} key={task.id}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.taskText}>{task.title}</Text>
          </View>
        ))}
      </View>
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
    fontSize: wp(4),
    marginBottom: hp(0.2),
    fontFamily: "kodchasan-regular",  
    fontSize: wp(5),
  },
});

export default OngoingScreen;
