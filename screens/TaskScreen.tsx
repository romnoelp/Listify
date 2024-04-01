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
import FloatingButton from "../components/FloatingButton";

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
      <TouchableOpacity>
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
        {/*Change to the floating button rotation shit  */}
        <FloatingButton
          onAddItemsPress={() => setIsAddTaskModalVisible(true)}
          onDeleteAllItemsPress={function (): void {
            throw new Error(
              "Where's the function, cuh? Define it first, bish."
            );
          }}
        ></FloatingButton>
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

  headerText: {
    fontFamily: "kodchasan-bold",
    fontSize: wp(5),
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
    fontSize: wp(4),
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
    width: wp(3),
    height: wp(3),
    borderRadius: wp(2.5),
    borderWidth: 2,
    marginRight: wp(3),
  },
  checkboxCompleted: {
    backgroundColor: "#414042", // Green color for completed tasks
    borderColor: "#414042", // Green border color for completed tasks
  },
  checkboxOverdue: {
    backgroundColor: "transparent", // Red color for overdue tasks
    borderColor: "#red", // Red border color for overdue tasks
  },
  checkboxDefault: {
    backgroundColor: "transparent", // Transparent background for default tasks
    borderColor: "#414042", // Black border color for default tasks
  },
});

export default TaskScreen;
