import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  BackHandler,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
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

const TaskScreen = () => {
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
        const docRef = db
          .collection("users")
          .doc(user.displayName.toString())
          .collection("Tasks");

        const CurrentDate = new Date();
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
    selectedTasks.forEach((item) => {
      updateTask(item.id, { status: "Completed" });
    });
    setIsMultipleSelect(false);
    setSelectedTasks([]);
    setSelectedIdentifier([]);
    if (selectedTasks.length === 0) {
      Toast.show("Please select a task to be completed", Toast.SHORT);
    }
  };

  const handleSelectItem = (item: ToDoTask) => {
    // select or unselect
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
          .collection("uesrs")
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
  //remove comments later
  return (
    <View style={styles.mainContainer}>
      {TasksList.filter((item) => item.status === "OnGoing").length !== 0 ? (
        <View style={styles.statusView}>
          <Text style={styles.statusTitle}>On Going</Text>
          <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={TasksList.filter((item) => item.status === "OnGoing")}
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
      {}
      {TasksList.filter((item) => item.status === "OverDue").length !== 0 ? (
        <View style={styles.statusView}>
          <Text style={styles.statusTitle}>Overdue</Text>
          <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={TasksList.filter((item) => item.status === "OverDue")}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  style={styles.flatListDesign}
                  onLongPress={() => {
                    !isMultipleSelect ? enableMultipleSelect() : {};
                  }}
                  onPress={() => handleSelectItem(item)}
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
      {TasksList.filter((item) => item.status === "Completed").length !== 0 ? (
        <View style={styles.statusView}>
          <Text style={styles.statusTitle}>Completed</Text>
          <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={TasksList.filter((item) => item.status === "Completed")}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  style={styles.flatListDesign}
                  onLongPress={() => {
                    !isMultipleSelect ? enableMultipleSelect() : {};
                  }}
                  onPress={() => handleSelectItem(item)}
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
        {/*Change to the floating button rotation shit  */}
        <FloatingButton
          onAddItemsPress={() => setIsAddTaskModalVisible(true)}
          onDeleteAllItemsPress={() => deleteItems()}
          onCompleteAllItemsPress={() => completeTask()}
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
  statusTitle: {
    fontFamily: "kodchasan-bold",
    fontSize: hp(3),
  },
  flatListDesign: {
    flexDirection: "row",
    marginVertical: hp(1),
    marginHorizontal: wp(3),
    alignItems: "center",
  },
  statusView: { marginHorizontal: wp(5), paddingHorizontal: wp(5), flex: 1 },
  taskTitle: {
    fontFamily: "kodchasan-light",
    fontSize: hp(2.2),
  },
  taskDueDate: {
    fontFamily: "kodchasan-light",
    fontSize: hp(1.2),
  },
});

export default TaskScreen;
