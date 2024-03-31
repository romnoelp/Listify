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

import DevelopersScreen from "../screens/DevelopersScreen";
import { useNavigation } from "@react-navigation/native";

interface NotificationsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const OptionsModal: React.FC<NotificationsModalProps> = ({
  isVisible,
  onClose,
}) => {
  const navigation = useNavigation();
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
              onPress={() => navigation.navigate("DevelopersScreen")}
            >
              <Text style={styles.buttonText}>Developers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => console.log("About the app")}
            >
              <Text style={styles.buttonText}>About the app</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => console.log("Logout")}
            >
              <Text style={styles.buttonText}>Logout</Text>
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
    borderRadius: 40,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(62),
    marginLeft: wp(28),
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

export default OptionsModal;
