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
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NotificationsModalProps } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../firebaseConfig";
import { BlurView } from "expo-blur";

const OptionsModal = ({ isVisible, onClose }: NotificationsModalProps) => {
  const navigation = useNavigation();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <BlurView intensity={70} tint="light" style={styles.container}>
          <View style={styles.modal}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate("DevelopersScreen" as never);
                onClose();
              }}
            >
              <Text style={styles.buttonText}>Developers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate("AboutAppScreen" as never);
              }}
            >
              <Text style={styles.buttonText}>About the app</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                auth.signOut();
                AsyncStorage.clear();
                onClose();
                navigation.dispatch(
                  CommonActions.reset({
                    index: 1,
                    routes: [{ name: "LandingScreen" }],
                  })
                );
              }}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: "rgba(255, 255, 255, .5)",
  },
  modal: {
    backgroundColor: "#414042",
    width: wp(50),
    borderRadius: 40,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(62),
    marginLeft: wp(38),
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
