import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { BlurView } from "expo-blur";
import { NotificationsModalProps } from "../types";
import { useNotificationContext } from "../context/notificationContext";
import { Entypo } from "@expo/vector-icons";
import { useTaskContext } from "../context/toDoTaskContext";

const NotificationsModal = ({
  isVisible,
  onClose,
}: NotificationsModalProps) => {
  const { NotificationList, setNewNotificationList } = useNotificationContext();
  const { TasksList } = useTaskContext();
  console.log("tasks", TasksList);
  const formatDateString = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const dueDateChecker = () => {
    const currentDate = new Date();
    const twoDaysBeforeDueDate = new Date(currentDate.getTime());
    twoDaysBeforeDueDate.setDate(currentDate.getDate() + 2);
    const tasksWithinTwoDays = TasksList.filter(
      (task) => task.dueDate <= twoDaysBeforeDueDate
    );
    if (tasksWithinTwoDays.length > 0) {
      setNewNotificationList(tasksWithinTwoDays);
    }
  };

  useEffect(() => {
    dueDateChecker();
  }, [TasksList]);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <BlurView intensity={70} tint="light" style={styles.container}>
          {NotificationList.length !== 0 ? (
            <View>
              <View style={styles.modal}>
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontFamily: "kodchasan-bold",
                  }}
                >
                  Upcoming events
                </Text>
                <View>
                  <FlatList
                    data={NotificationList}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-evenly",
                          marginVertical: hp(1),
                        }}
                      >
                        <Entypo
                          name="controller-record"
                          size={12}
                          color="white"
                        />
                        <View>
                          <Text style={styles.flatListElements}>
                            {item.taskTitle}
                          </Text>
                          <Text style={styles.flatListElements}>
                            {formatDateString(item.dueDate)}
                          </Text>
                        </View>
                      </View>
                    )}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View style={[styles.modal, { justifyContent: "center" }]}>
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontFamily: "kodchasan-light",
                }}
              >
                No upcoming events
              </Text>
            </View>
          )}
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  modal: {
    backgroundColor: "#414042",
    width: wp(60),
    height: hp(40),
    borderRadius: 40,
    padding: 20,

    marginBottom: hp(55),
    marginLeft: wp(15),
  },
  button: {
    marginBottom: 10,
    padding: 10,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#414042",
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: "kodchasan-light",
    color: "#FFFFFF",
    fontSize: 16,
  },
  flatListElements: {
    color: "white",
    fontFamily: "kodchasan-light",
  },
});

export default NotificationsModal;
