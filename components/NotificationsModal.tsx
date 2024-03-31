import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface NotificationsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isVisible,
  onClose,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => console.log("Clear notifications")}
            >
              <Text style={styles.buttonText}>Clear notifications</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    backgroundColor: "#414042",
    width: wp(60),
    height: hp(30),
    borderRadius: 40,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
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
});

export default NotificationsModal;
