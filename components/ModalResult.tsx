import { FlatList, Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ToDoTask } from "../types";

type Props = {
  showModalResult: boolean;
  closeResultModal: () => void;
  resultList: ToDoTask[];
  formatDateString: (date: Date) => string;
};

const ModalResult = ({
  showModalResult,
  closeResultModal,
  resultList,
  formatDateString,
}: Props) => {
  return (
    <Modal
      visible={showModalResult}
      onRequestClose={() => closeResultModal()}
      transparent
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "#414042",
            height: hp(60),
            width: wp(90),
            borderRadius: wp(5),
          }}
        >
          <Text
            style={{
              fontFamily: "kodchasan-semibold",
              fontSize: hp(3),
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            Result
          </Text>
          <FlatList
            data={resultList}
            renderItem={({ item }) => (
              <View style={{ marginLeft: wp(3), marginVertical: hp(2) }}>
                <Text style={styles.taskTitle}>{item.taskTitle}</Text>
                <Text style={styles.taskDueDate}>
                  {formatDateString(item.dueDate)}
                </Text>
                <Text style={styles.taskDueDate}>{item.status}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ModalResult;

const styles = StyleSheet.create({
  taskTitle: {
    fontFamily: "kodchasan-light",
    fontSize: hp(1.8),
    color: "white",
  },
  taskDueDate: {
    fontFamily: "kodchasan-light",
    fontSize: hp(1.2),
    marginLeft: wp(0.3),
    color: "white",
  },
});
