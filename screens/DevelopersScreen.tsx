import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; 
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const DevelopersScreen = () => {
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
        <Text style={styles.headerText}>Developers</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.devContainer}>
          <Image
            source={require("../devImages/Rom.jpg")}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text
              style={{
                fontFamily: "kodchasan-semibold",
                textAlign: "left",
                fontSize: wp(4.5),
              }}
            >
              Petracorta, Romnoel E.
            </Text>
            <Text style={{ fontFamily: "kodchasan-regular" }}>
              Role: UI/UX Designer | Programmer
            </Text>
            <Text style={{ fontFamily: "kodchasan-regular" }}>
              Preferred language: C#. Python
            </Text>
          </View>
        </View>
        <View style={styles.devContainer}>
          <Image
            source={require("../devImages/Rich.jpg")}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text
              style={{
                fontFamily: "kodchasan-semibold",
                textAlign: "left",
                fontSize: wp(4.5),
              }}
            >
              Baltazar Richmond A.
            </Text>
            <Text style={{ fontFamily: "kodchasan-regular" }}>
              Role: Lead Programmer
            </Text>
            <Text style={{ fontFamily: "kodchasan-regular" }}>
              Preferred language: Typescript, Javascript
            </Text>
          </View>
        </View>
        <View style={styles.devContainer}>
          <Image
            source={require("../devImages/Kevs.jpg")}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text
              style={{
                fontFamily: "kodchasan-semibold",
                textAlign: "left",
                fontSize: wp(4.5),
              }}
            >
              Lisboa Kevin M.
            </Text>
            <Text style={{ fontFamily: "kodchasan-regular" }}>
              Role: Programmer
            </Text>
            <Text style={{ fontFamily: "kodchasan-regular" }}>
              Preferred language: Java
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: wp(2),
  },
  devContainer: {
    marginTop: hp(5),
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  image: {
    width: wp(30),
    height: hp(15),
    marginRight: 10,
    borderRadius: wp(4),
  },
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
    color: "#333333",
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

export default DevelopersScreen;
