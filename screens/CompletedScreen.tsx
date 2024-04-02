import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Entypo } from "@expo/vector-icons";
import { useTaskContext } from "../context/toDoTaskContext";
import Toast from "react-native-simple-toast";
import { auth, db } from "../firebaseConfig";
import AddModal from "../components/AddModal";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { ToDoTask } from "../types";
import FloatingButton from "../components/FloatingButton";


const CompletedScreen = () => {
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showClock, setShowClock] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const { addTask, TasksList } = useTaskContext();

  const user = auth.currentUser;
  // const [tasks, setTasks] = useState<Task[]>([
  //   { id: 1, title: "Complete homework", status: "On Going" },
  //   { id: 4, title: "Bebetaym", status: "On Going" },
  // ]);

  const handleToggleTaskStatus = (id: number) => {
    // Implement logic to change task status
  };

  const handleDeleteTask = (id: number) => {
    // Implement logic to delete task
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
  console.log(TasksList);

  const saveTask = async () => {
    try {
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes

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

  // const renderItem = ({ item }: { item: Task }) => (
  //   <View style={styles.taskContainer}>
  //     <TouchableOpacity onPress={() => handleToggleTaskStatus(item.id)}>
  //       {item.status === "Completed" ? (
  //         <View style={[styles.checkbox, styles.checkboxCompleted]} />
  //       ) : item.status === "Overdue" ? (
  //         <View style={[styles.checkbox, styles.checkboxOverdue]} />
  //       ) : (
  //         <View style={[styles.checkbox, styles.checkboxDefault]} />
  //       )}
  //     </TouchableOpacity>
  //     <Text style={styles.taskText}>{item.title}</Text>
  //   </View>
  // );

    <View style={styles.mainContainer}>
      {sortedTasks.length !== 0 ? (
        <View style={styles.statusView}>
          <Text style={styles.statusTitle}>Finished</Text>
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
<<<<<<< Updated upstream
          onDeleteAllItemsPress={function (): void {
            throw new Error(
              "Where's the function, cuh? Define it first, bish."
            );
          } } onCompleteAllItemsPress={function (): void {
            throw new Error("Function not implemented.");
          } }        ></FloatingButton>
=======
          onDeleteAllItemsPress={() => deleteItems()}
          onCompleteAllItemsPress={() => completeTask()}
        />
>>>>>>> Stashed changes
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
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: wp(5),
  },
  header: {
    fontFamily: "kodchasan-bold",
<<<<<<< Updated upstream
    fontSize: wp(6.5),
    color: "#414042",
    marginBottom: hp(0.5),
=======
    fontSize: hp(2.5),
>>>>>>> Stashed changes
  },
  listContainer: {
    marginBottom: hp(5),
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
  },
<<<<<<< Updated upstream
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
    backgroundColor: "#D20062",
    borderColor: "#D20062",
  },
  checkboxDefault: {
    backgroundColor: "transparent",
=======
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
>>>>>>> Stashed changes
    borderColor: "#000",
  },
  taskText: {
    fontFamily: "kodchasan-regular",
    fontSize: wp(4),
    flex: 1,
  },
});

export default CompletedScreen;
