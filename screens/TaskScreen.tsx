import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Entypo } from "@expo/vector-icons";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import AddModal from "../components/AddModal";
import { auth, db } from "../firebaseConfig";
import { ToDoTask } from "../types";
import { useTaskContext } from "../context/toDoTaskContext";
import Toast from "react-native-simple-toast";

interface Task {
  id: number;
  title: string;
  status: string;
}

const TaskScreen = () => {
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showClock, setShowClock] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const { addTask, TasksList } = useTaskContext();

  const user = auth.currentUser;

  console.log(dueDate.toLocaleString());

  // Sample tasks data for testing
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Complete homework", status: "On Going" },
    { id: 2, title: "Go for a run", status: "Overdue" },
    { id: 3, title: "Buy groceries", status: "Completed" },
  ]);

  // Group tasks by status
  const groupedTasks: { [key: string]: Task[] } = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as { [key: string]: Task[] });

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.bulletPoint}>•</Text>
      <Text style={styles.taskText}>{item.title}</Text>
    </View>
  );
  const showDatepicker = () => {
    setShowCalendar(!showCalendar);
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      const currentDate = selectedDate;
      setDueDate(currentDate);
      if (Platform.OS === "android") {
        setShowClock(true);
        setShowCalendar(false);
      }
    }
    showDatepicker(); // Always call showDatepicker after handling date change
  };

  const onChangeTime = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      const currentDate = selectedDate;
      setDueDate(currentDate);
      if (Platform.OS === "android") {
        setShowClock(false);
      }
    }
  };

  const formatDateString = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const closeAddTaskModal = () => {
    setIsAddTaskModalVisible(!isAddTaskModalVisible);
    setTaskDescription("");
    setTaskTitle("");
  };
  console.log(TasksList);

  const saveTask = async () => {
    try {
      if (user) {
        const docRef = db
          .collection("users")
          .doc(user.displayName?.toString())
          .collection("Tasks");

        const CurrentDate = new Date();
        console.log(CurrentDate);
        const statusCheck = CurrentDate > dueDate ? "OverDue" : "OnGoing";
        await docRef.add({
          taskTitle,
          taskDescription,
          dueDate: dueDate,
          status: statusCheck,
        });

        const newTask: ToDoTask = {
          id: docRef.id,
          taskTitle,
          taskDescription,
          dueDate,
          status: statusCheck,
        };

        addTask(newTask);
        Toast.show("Added Successfully", Toast.SHORT);
        closeAddTaskModal();
      }
    } catch (error) {
      Toast.show("Error occured, try again later", Toast.SHORT);
    }
  };

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
      {groupedTasks["Overdue"] && <View style={styles.headerUnderline}></View>}
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
      <View
        style={{
          position: "absolute",
          bottom: wp(10),
          right: wp(40),
          left: wp(40),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            padding: wp(3),
            borderRadius: wp(8),
            backgroundColor: "#414042",
          }}
          onPress={() => setIsAddTaskModalVisible(true)}
        >
          <Entypo name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <AddModal //use this to show addModal
        dueDate={dueDate}
        formatDateString={formatDateString}
        isAddTaskModalVisible={isAddTaskModalVisible}
        onChangeDate={onChangeDate}
        onChangeTime={onChangeTime}
        setIsAddTaskModalVisible={setIsAddTaskModalVisible}
        setShowCalendar={setShowCalendar}
        showCalendar={showCalendar}
        showClock={showClock}
        saveTask={saveTask}
        setTaskTitle={setTaskTitle}
        setTaskDescription={setTaskDescription}
        taskDescription={taskDescription}
        taskTitle={taskTitle}
        closeAddTaskModal={closeAddTaskModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {},
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
