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
import { useNotificationContext } from "../context/notificationContext";

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
  const [sortedTasksList, setSortedTasksList] = useState<ToDoTask[]>([]);
  const { setNewNotificationList, addNotification } = useNotificationContext();

  const user = auth.currentUser;

  useFocusEffect(
    useCallback(() => {
      setIsMultipleSelect(false);
      setSelectedTasks([]);
      setSelectedIdentifier([]);
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
          const currentDate = new Date();
          const twoDaysBeforeDueDate = new Date(currentDate.getTime());
          setNewNotificationList(
            fetchedData.filter((task) => task.dueDate <= twoDaysBeforeDueDate)
          );
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
    if (event.type === "dismissed") {
      setShowCalendar(false);
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
            taskTitle: taskTitle.trim() === "" ? "No Title" : taskTitle,
            taskDescription,
            dueDate: dueDate,
            status: statusCheck,
          });

        const newTask: ToDoTask = {
          id: docRef.id,
          taskTitle: taskTitle.trim() === "" ? "No Title" : taskTitle,
          taskDescription,
          dueDate,
          status: statusCheck,
        };

        addTask(newTask);
        const currentDate = new Date();
        const twoDaysBeforeDueDate = new Date(currentDate.getTime());
        if (newTask.dueDate <= twoDaysBeforeDueDate) {
          addNotification(newTask);
        }
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
    setSelectedTasks([]);
    setSelectedIdentifier([]);
    return true;
  };

  const sortData = (array: ToDoTask[]) => {
    return array.sort((a, b) => {
      const aDueDate = a.dueDate.getTime();
      const bDueDate = b.dueDate.getTime();
      return aDueDate - bDueDate;
    });
  };

  useEffect(() => {
    const sortedArray = sortData(TasksList);
    setSortedTasksList(sortedArray);

    if (!initialFetch) {
      readData();
    }

    const backPressHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      backPressHandler.remove();
      setInitialFetch(true);
    };
  }, [TasksList]);

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
        const currentDate = new Date();
        const twoDaysBeforeDueDate = new Date(currentDate.getTime());
        twoDaysBeforeDueDate.setDate(currentDate.getDate() + 2);
        setNewNotificationList(
          updatedTasksList.filter(
            (task) => task.dueDate <= twoDaysBeforeDueDate
          )
        );

        Toast.show("Items deleted successfully", Toast.SHORT);
        setSelectedTasks([]);
        setSelectedIdentifier([]);
        setIsMultipleSelect(false);
      } catch (error) {
        Toast.show("Error deleting items, try again later", Toast.SHORT);
      }
    }
  };
  //remove comments later
  return (
    <View style={styles.mainContainer}>
      {sortedTasksList.length !== 0 ? (
        <View style={styles.subContainer}>
          {sortedTasksList.filter((item) => item.status === "OnGoing")
            .length !== 0 ? (
            <View style={styles.statusView}>
              <View style={styles.parentStatusView}>
                <Text style={styles.statusTitle}>On Going</Text>
                <View style={styles.circularPending}>
                  <Text
                    style={{ fontFamily: "kodchasan-light", fontSize: hp(1.5) }}
                  >
                    {sortedTasksList
                      .filter((item) => item.status === "OnGoing")
                      .length.toString()}
                  </Text>
                </View>
              </View>

              <FlatList
                keyExtractor={(item) => item.id.toString()}
                data={sortedTasksList.filter(
                  (item) => item.status === "OnGoing"
                )}
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
          {sortedTasksList.filter((item) => item.status === "OverDue")
            .length !== 0 ? (
            <View style={styles.statusView}>
              <View style={styles.parentStatusView}>
                <Text style={styles.statusTitle}>Overdue</Text>
                <View style={styles.circularPending}>
                  <Text
                    style={{ fontFamily: "kodchasan-light", fontSize: hp(1.5) }}
                  >
                    {sortedTasksList
                      .filter((item) => item.status === "OverDue")
                      .length.toString()}
                  </Text>
                </View>
              </View>
              <FlatList
                keyExtractor={(item) => item.id.toString()}
                data={sortedTasksList.filter(
                  (item) => item.status === "OverDue"
                )}
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
          {sortedTasksList.filter((item) => item.status === "Completed")
            .length !== 0 ? (
            <View style={styles.statusView}>
              <View style={styles.parentStatusView}>
                <Text style={styles.statusTitle}>Finished</Text>
                <View style={styles.circularPending}>
                  <Text
                    style={{ fontFamily: "kodchasan-light", fontSize: hp(1.5) }}
                  >
                    {sortedTasksList
                      .filter((item) => item.status === "Completed")
                      .length.toString()}
                  </Text>
                </View>
              </View>
              <FlatList
                keyExtractor={(item) => item.id.toString()}
                data={sortedTasksList.filter(
                  (item) => item.status === "Completed"
                )}
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
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontFamily: "kodchasan-light" }}>
            Add a task to get started
          </Text>
        </View>
      )}

      <View
        style={{
          position: "absolute",
          bottom: wp(10),
          right: wp(40),
        }}
      >
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
  subContainer: {
    flex: 1,
    marginBottom: hp(14),
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
  statusView: { marginHorizontal: wp(0), paddingHorizontal: wp(5), flex: 1 },
  taskTitle: {
    fontFamily: "kodchasan-light",
    fontSize: hp(1.8),
  },
  taskDueDate: {
    fontFamily: "kodchasan-light",
    fontSize: hp(1.2),
    marginLeft: wp(0.3),
  },
  circularPending: {
    borderWidth: wp(0.5),
    marginHorizontal: wp(2),
    borderRadius: wp(10),
    width: wp(6),
    height: hp(3),
    alignItems: "center",
  },
  parentStatusView: { flexDirection: "row", alignItems: "center" },
});

export default TaskScreen;
