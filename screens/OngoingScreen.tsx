import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  BackHandler,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from "@expo/vector-icons";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import AddModal from "../components/AddModal";
import { auth, db } from "../firebaseConfig";
import { ToDoTask } from "../types";
import { useTaskContext } from "../context/toDoTaskContext";
import Toast from "react-native-simple-toast";
import FloatingButton from "../components/FloatingButton";
import firebase from "firebase/compat/app";
import { useFocusEffect } from "@react-navigation/native";
import { Entypo } from '@expo/vector-icons';



const OngoingScreen = () => {
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showClock, setShowClock] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const { addTask, TasksList, setNewTasksList, updateTask } = useTaskContext();
  const [isMultipleSelect, setIsMultipleSelect] = useState(false);
  const [initialFetch, setInitialFetch] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<ToDoTask[]>([]);
  const [selectedIdentifier, setSelectedIdentifier] = useState<String[]>([]);
  const [isAscending, setIsAscending] = useState(true); 

  const user = auth.currentUser;

  useFocusEffect(
    useCallback(() => {
      setIsMultipleSelect(false);
      return () => {
        // Cleanup function, if needed
      };
    }, [])
  );

  const convertTimestampToDate = (
    timestamp: firebase.firestore.Timestamp
  ): Date => {
    const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6;
    return new Date(milliseconds);
  };

  const readData = async () => {
    try {
      if (user && user.displayName) {
        const fetchedData: ToDoTask[] = [];
        const docRef = db
          .collection("users")
          .doc(user.displayName.toString())
          .collection("Tasks");
        const querySnapshot = await docRef.get();
        querySnapshot.forEach((doc) => {
          const { taskTitle, taskDescription, dueDate, status } = doc.data();
          fetchedData.push({
            id: doc.id,
            taskTitle,
            taskDescription,
            dueDate: convertTimestampToDate(dueDate),
            status,
          });
        });

        if (!initialFetch) {
          setNewTasksList(fetchedData);
          setInitialFetch(true);
        }
      }
    } catch (error) {
      Toast.show("Error getting data", Toast.SHORT);
    }
  };

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

  const enableMultipleSelect = () => {
    setIsMultipleSelect(true);
  };

  const saveTask = async () => {
    //save task after finishing in addModal
    try {
      if (user && user.displayName) {
        const CurrentDate = new Date();
        const statusCheck = CurrentDate > dueDate ? "OverDue" : "OnGoing";
        const docRef = await db
          .collection("users")
          .doc(user.displayName.toString())
          .collection("Tasks")
          .add({
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

  const handleBackPress = () => {
    //cancels the multiple selection mode when back button was pressed
    setIsMultipleSelect(false);
    return true;
  };

  useEffect(() => {
    readData();
    const backPressHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      backPressHandler.remove();
    };
  }, []);

  const completeTask = () => {
    //comeplete the task when flag was pressed
    try {
      if (user && user.displayName) {
        const docRef = db
          .collection("users")
          .doc(user.displayName.toString())
          .collection("Tasks");
        selectedTasks.forEach(async (item) => {
          await docRef.doc(item.id.toString()).update({
            status: "Completed",
          });
          updateTask(item.id, { status: "Completed" });
        });
        setIsMultipleSelect(false);
        setSelectedTasks([]);
        setSelectedIdentifier([]);
        if (selectedTasks.length === 0) {
          Toast.show("Please select a task to be completed", Toast.SHORT);
        }
      }
    } catch (error) {
      Toast.show("Error updating in database, try again later", Toast.SHORT);
    }
  };

  const handleSelectItem = (item: ToDoTask) => {
    
    if (isMultipleSelect) {
      if (selectedIdentifier.includes(item.id)) {
        setSelectedTasks(
          selectedTasks.filter((selected) => selected.id === item.id)
        );
        setSelectedIdentifier(
          selectedIdentifier.filter((selected) => selected !== item.id)
        );
      } else {
        setSelectedTasks((prev) => [...prev, item]);
        setSelectedIdentifier((prev) => [...prev, item.id]);
      }
    }
  };

  const deleteItems = async () => {
    if (user && user.displayName) {
      try {
        const dbRef = db
          .collection("users")
          .doc(user.displayName.toString())
          .collection("Tasks");
        const batch = db.batch();

        selectedTasks.forEach((item) => {
          batch.delete(dbRef.doc(item.id.toString()));
        });

        await batch.commit();

        const updatedTasksList = TasksList.filter(
          (task) => !selectedTasks.some((selected) => selected.id === task.id)
        );

        setNewTasksList(updatedTasksList);

        Toast.show("Items deleted successfully", Toast.SHORT);
        setSelectedTasks([]);
        setSelectedIdentifier([]);
      } catch (error) {
        Toast.show("Error deleting items, try again later", Toast.SHORT);
      }
    }
  };

  const selectionSortAscending = (tasksList: ToDoTask[]): ToDoTask[] => {
    const sortedTasks = [...tasksList];
  
    for (let i = 0; i < sortedTasks.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < sortedTasks.length; j++) {
        if (sortedTasks[j].dueDate < sortedTasks[minIndex].dueDate) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        
        const temp = sortedTasks[i];
        sortedTasks[i] = sortedTasks[minIndex];
        sortedTasks[minIndex] = temp;
      }
    }
  
    return sortedTasks;
  };
  
  const selectionSortDescending = (tasksList: ToDoTask[]): ToDoTask[] => {
    const sortedTasks = [...tasksList];
  
    for (let i = 0; i < sortedTasks.length - 1; i++) {
      let maxIndex = i;
      for (let j = i + 1; j < sortedTasks.length; j++) {
        if (sortedTasks[j].dueDate > sortedTasks[maxIndex].dueDate) {
          maxIndex = j;
        }
      }
      if (maxIndex !== i) {
        
        const temp = sortedTasks[i];
        sortedTasks[i] = sortedTasks[maxIndex];
        sortedTasks[maxIndex] = temp;
      }
    }
  
    return sortedTasks;
  };

  const handleSortToggle = () => {
    setIsAscending((prev) => !prev); // Toggle sorting order
  };
  const sortedTasks = isAscending
    ? selectionSortAscending(TasksList.filter((item) => item.status === "OnGoing"))
    : selectionSortDescending(TasksList.filter((item) => item.status === "OnGoing"));

  return (
    <View style={styles.mainContainer}>
      {TasksList.filter((item) => item.status === "OnGoing").length !== 0 ? (
        <View style={styles.statusView}>
          <Text style={styles.statusTitle}>On Going</Text>
          <TouchableOpacity style={styles.sortIndicator} onPress={handleSortToggle}>
              <Text>{isAscending ?<Entypo name="chevron-with-circle-up" size={28} color="black" /> 
              : <Entypo name="chevron-with-circle-down" size={28} color="black" />}</Text>
          </TouchableOpacity>
          <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={sortedTasks}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  style={styles.flatListDesign}
                  onLongPress={() => {
                    !isMultipleSelect ? enableMultipleSelect() : {};
                  }}
                  onPress={() => {
                    handleSelectItem(item);
                  }}
                >
                  {isMultipleSelect ? (
                    selectedIdentifier.includes(item.id) ? (
                      <Feather
                        name="check-circle"
                        size={14}
                        color="black"
                        style={{ marginRight: wp(1) }}
                      />
                    ) : (
                      <Feather
                        name="circle"
                        size={14}
                        color="black"
                        style={{ marginRight: wp(1) }}
                      />
                    )
                  ) : null}
                  <View>
                    <Text style={styles.taskTitle}>{item.taskTitle}</Text>
                    <Text style={styles.taskDueDate}>
                      {formatDateString(item.dueDate)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      ) : null}

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
        {/* Floating button component */}
        <FloatingButton
          onAddItemsPress={() => setIsAddTaskModalVisible(true)}
          onDeleteAllItemsPress={() => deleteItems()}
          onCompleteAllItemsPress={() => completeTask()}
        />
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
  statusTitle: {
    fontFamily: "kodchasan-bold",
    fontSize: hp(2.5),
  },
  flatListDesign: {
    flexDirection: "row",
    marginVertical: hp(1),
    marginHorizontal: wp(3),
    alignItems: "center",
  },
  statusView: { marginHorizontal: wp(1), paddingHorizontal: wp(5), flex: 1 },
  taskTitle: {
    fontFamily: "kodchasan-light",
    fontSize: hp(1.8),
  },
  taskDueDate: {
    fontFamily: "kodchasan-light",
    fontSize: hp(1.2),
    marginLeft: wp(0.3)
  },
  sortIndicator: {
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderColor: "#000",
    position: "absolute",
    right: 10,
    top: 10,
  },
});

export default OngoingScreen;
