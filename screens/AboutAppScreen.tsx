import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const AboutAppScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ marginTop: hp(3) }}
          onPress={() => navigation.goBack()}
        >
          <Entypo name="chevron-left" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>About the App</Text>
      </View>

      <View style={styles.container}>
        <Text
          style={{
            marginHorizontal: wp(1),
            marginVertical: hp(1),
            fontFamily: "kodchasan-regular",
            lineHeight: hp(3),
            textAlign: "justify",
          }}
        >
          Introducing Listify: the minimalist to-do list app designed to
          simplify your task management and declutter your mind. With its clean
          and intuitive interface, Listify makes note-taking effortless,
          providing a streamlined canvas for organizing your tasks. But Listify
          doesn't stop there. It goes beyond basic task management with its
          advanced interpolation search algorithm, ensuring that your tasks are
          sorted intelligently for quick access to what matters most. Available
          for both Android and iOS, Listify offers a seamless cross-platform
          experience, allowing you to stay productive no matter where you are.
          Say goodbye to cluttered interfaces and overwhelming to-do lists.
          Embrace simplicity and efficiency with Listify. Download now and take
          control of your productivity.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginBottom: hp(-1),
  },
  headerText: {
    marginTop: hp(3),
    flex: 1,
    fontSize: wp(6),
    color: "#414042",
    textAlign: "center",
    alignSelf: "center",
    fontFamily: "kodchasan-bold",
    right: wp(2),
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

export default AboutAppScreen;
