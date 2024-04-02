import React from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { BlurView } from "expo-blur";

type AddModalProps = {
  isAddTaskModalVisible: boolean;
  setIsAddTaskModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  dueDate: Date;
  showCalendar: boolean;
  setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  showClock: boolean;
  onChangeDate: (event: DateTimePickerEvent, selectedDate?: Date) => void;
  onChangeTime: (event: DateTimePickerEvent, selectedDate?: Date) => void;
  formatDateString: (date: Date) => string;
  taskTitle: string;
  setTaskTitle: React.Dispatch<React.SetStateAction<string>>;
  taskDescription: string;
  setTaskDescription: React.Dispatch<React.SetStateAction<string>>;
  saveTask: () => Promise<void>;
  closeAddTaskModal: () => void;
};

const AddModal = ({
  isAddTaskModalVisible,
  setIsAddTaskModalVisible,
  dueDate,
  showCalendar,
  setShowCalendar,
  showClock,
  onChangeDate,
  onChangeTime,
  formatDateString,
  taskTitle,
  setTaskTitle,
  setTaskDescription,
  taskDescription,
  saveTask,
  closeAddTaskModal,
}: AddModalProps) => {
  return (
    <Modal
      visible={isAddTaskModalVisible}
      onRequestClose={() => closeAddTaskModal()}
      animationType="fade"
      transparent
    >
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: wp(10),
          height: hp(70),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: wp(10),
          }}
        >
          <TouchableOpacity onPress={() => saveTask()}>
            <Text style={styles.modalTopText}>Save</Text>
          </TouchableOpacity>
          <Text style={[styles.modalTopText, { fontFamily: "kodchasan-bold" }]}>
            Task
          </Text>
          <TouchableOpacity onPress={() => setIsAddTaskModalVisible(false)}>
            <Text style={styles.modalTopText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginHorizontal: wp(10) }}>
          <TextInput
            placeholder="Add Title"
            style={{
              fontSize: hp(3),
              paddingLeft: wp(5),
              padding: wp(10),
              fontFamily: "kodchasan-extralight",
            }}
            value={taskTitle}
            onChangeText={(text) => setTaskTitle(text)}
          />
        </View>
        <View style={{ backgroundColor: "#414042", flex: 1 }}>
          <View style={{ marginHorizontal: wp(10), marginTop: hp(3) }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Entypo name="calendar" size={24} color="white" />
              <Text style={styles.modalLabel}>Due Date</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: hp(1),
              }}
            >
              <Text
                style={[
                  styles.modalLabel,
                  { fontSize: hp(2), marginLeft: wp(0) },
                ]}
              >
                {formatDateString(dueDate)}
              </Text>
              <TouchableOpacity onPress={() => setShowCalendar(true)}>
                <Entypo name="chevron-right" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderBottomWidth: wp(0.5),
                borderBottomColor: "#FFFFFF",
                marginTop: hp(2),
              }}
            />
            <View
              style={{
                flexDirection: "row",
                marginTop: hp(2),
                alignItems: "center",
              }}
            >
              <Entypo name="info" size={24} color="white" />
              <Text style={styles.modalLabel}>Description</Text>
            </View>
            <View
              style={{
                height: hp(20),
                borderWidth: wp(0.1),
                borderColor: "white",
                marginTop: hp(2),
              }}
            >
              <TextInput
                placeholder="Add Description"
                style={[
                  styles.modalLabel,
                  { marginTop: hp(2), paddingVertical: hp(1) },
                ]}
                value={taskDescription}
                onChangeText={(text) => setTaskDescription(text)}
                placeholderTextColor={"gray"}
                multiline
              />
            </View>
          </View>
        </View>
        {showCalendar && (
          <RNDateTimePicker
            mode="date"
            display="calendar"
            value={dueDate}
            onChange={onChangeDate}
          />
        )}
        {showClock && (
          <RNDateTimePicker
            mode="time"
            display="clock"
            value={dueDate}
            onChange={onChangeTime}
          />
        )}
      </View>
      <BlurView intensity={100} tint="light" style={{ flex: 1 }}></BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalTopText: {
    fontFamily: "kodchasan-light",
    fontSize: hp(2.2),
  },
  modalLabel: {
    fontFamily: "kodchasan-extralight",
    color: "white",
    marginLeft: wp(3),
  },
});

export default AddModal;
