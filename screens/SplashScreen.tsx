import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { landingScreenLogo } from "../loadSVG";
import { SvgXml } from "react-native-svg";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { MainStackParamList } from "../types";
import { auth, db } from "../firebaseConfig";

type SplashScreenProps = {
  navigation: StackNavigationProp<MainStackParamList, "SplashScreen">;
};

const SplashScreen = ({ navigation }: SplashScreenProps) => {
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("email");
        const savedPassword = await AsyncStorage.getItem("password");

        if (savedEmail && savedPassword) {
          await auth.signInWithEmailAndPassword(savedEmail, savedPassword);
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: "MainTopTab",
                },
              ],
            })
          );
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: "LoginScreen" }],
            })
          );
        }
      } catch (error) {
        console.error("Bro this is the error, bitch.:", error);
      }
    };
    checkLoggedIn();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <SvgXml xml={landingScreenLogo} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: "10%",
    width: "10%",
  },
});

export default SplashScreen;
