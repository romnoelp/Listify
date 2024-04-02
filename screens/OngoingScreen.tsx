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
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import AddModal from "../components/AddModal";
import { auth, db } from "../firebaseConfig";
import { ToDoTask } from "../types";
import { useTaskContext } from "../context/toDoTaskContext";
import Toast from "react-native-simple-toast";
import FloatingButton from "../components/FloatingButton";
import firebase from "firebase/compat/app";
import { useFocusEffect } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { Button } from "@rneui/base";
import ModalResult from "../components/ModalResult";

const OngoingScreen = () => {
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showClock, setShowClock] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const { addTask, TasksList, setNewTasksList, updateTask } = useTaskContext();
  const [isMultipleSelect, setIsMultipleSelect] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<ToDoTask[]>([]);
  const [selectedIdentifier, setSelectedIdentifier] = useState<String[]>([]);
  const [sortedList, setSortedList] = useState<ToDoTask[]>([]);
  const [iniitalRender, setInitialRender] = useState(false);
  const [searchDate, setSearchDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModalResult, setShowModalResult] = useState(false);

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
    if (event.type === "dismissed") {
      setShowClock(false);
    }
  };
  console.log(
    sortedList.map((item) => {
      const month = item.dueDate.getMonth();
      const day = item.dueDate.getDate();
      return { month, day };
    })
  );
  const onChangeDateSearch = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    // for date searching
    if (event.type === "set" && selectedDate) {
      const currentDate = selectedDate;
      setSearchDate(currentDate);
      if (Platform.OS === "android") {
        setShowDatePicker(false);
      }
      setShowModalResult(true);
    }
    if (event.type === "dismissed") {
      setShowDatePicker(false);
    }

    return () => setShowDatePicker(!showDatePicker);
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

        Toast.show("Items deleted successfully", Toast.SHORT);
        setSelectedTasks([]);
        setSelectedIdentifier([]);
        setIsMultipleSelect(false);
      } catch (error) {
        Toast.show("Error deleting items, try again later", Toast.SHORT);
      }
    }
  };

  const sortFilteredData = (array: ToDoTask[]) => {
    return array
      .filter((item) => item.status === "OnGoing")
      .sort((a, b) => {
        const aDueDate = a.dueDate.getTime();
        const bDueDate = b.dueDate.getTime();
        return aDueDate - bDueDate;
      });
  };

  useEffect(() => {
    const sortedArray = sortFilteredData(TasksList);
    setSortedList(sortedArray);

    const backPressHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      if (!iniitalRender) {
        backPressHandler.remove();
      }
      setInitialRender(true);
    };
  }, [TasksList]);

  const closeResultModal = () => {
    setShowModalResult(false);
  };

  return (
    <View style={styles.mainContainer}>
      <Button
        title={"Search Date"}
        buttonStyle={{
          backgroundColor: "#FFFFFF",
          borderWidth: wp(0.5),
          borderColor: "#414042",
          marginHorizontal: wp(4),
          borderRadius: wp(4),
          marginTop: hp(1),
          justifyContent: "flex-start",
        }}
        onPress={() => setShowDatePicker(true)}
      >
        <Entypo name="magnifying-glass" size={20} color="black" />
        <Text style={{ marginLeft: wp(2), fontFamily: "kodchasan-extralight" }}>
          Looking for a specific task?
        </Text>
      </Button>
      {sortedList.length !== 0 ? (
        <View style={styles.statusView}>
          <Text style={styles.statusTitle}>On Going</Text>
          <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={sortedList}
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

      {showDatePicker && (
        <RNDateTimePicker
          mode="date"
          display="calendar"
          value={searchDate}
          onChange={onChangeDateSearch}
        />
      )}

      <ModalResult
        closeResultModal={closeResultModal}
        showModalResult={showModalResult}
        resultList={sortedList.filter((item) => {
          const itemDate = new Date(item.dueDate);
          return (
            itemDate.getMonth() === searchDate.getMonth() &&
            itemDate.getDate() === searchDate.getDate()
          );
        })}
        formatDateString={formatDateString}
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
    marginLeft: wp(0.3),
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
