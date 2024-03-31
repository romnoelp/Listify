import React, { useState, useEffect } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../types";
import { SvgXml } from "react-native-svg";
import { Entypo } from "@expo/vector-icons";
import { Button } from "@rneui/base";
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig";
import { loginScreenLogo } from "../loadSVG";
import { loadFont } from "../loadFont";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

type LoginScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  "LoginScreen"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen = ({ navigation }: Props) => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadFont().then(() => setFontLoaded(true));
  }, []);

  const signIn = async () => {
    if (userName && password) {
      try {
        const docRefEmail = await db.collection("users").doc(userName).get();
        let userEmail;
        if (docRefEmail.exists) {
          userEmail = docRefEmail.data();
        } else {
          Toast.show("Error occurred, please try again later.", Toast.SHORT);
        }
        if (userEmail) {
          await auth.signInWithEmailAndPassword(userEmail.email, password);
          AsyncStorage.setItem("email", userEmail.email);
          AsyncStorage.setItem("password", password);
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: "MainTopTab" }],
            })
          );
        }
      } catch (error) {
        Toast.show("Error signing in.", Toast.SHORT);
      }
    } else {
      Toast.show("Please enter your credentials to sign in.", Toast.LONG);
    }
  };

  if (!fontLoaded) {
    return null;
  }

  const handleRegisterPress = () => {
    navigation.replace("RegisterScreen");
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <SvgXml xml={loginScreenLogo} style={styles.logo} />
        <Text style={styles.logoTitle}>Listify</Text>
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.inputField}
          onChangeText={(text) => setUserName(text)}
          value={userName}
          placeholder="Username"
          placeholderTextColor="#8F8F8F"
        />
        <View style={{ position: "relative" }}>
          <TextInput
            style={styles.inputField}
            onChangeText={(text) => setPassword(text)}
            value={password}
            placeholder="Password"
            placeholderTextColor="#8F8F8F"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: wp(7), top: hp(5) }}
          >
            <Entypo
              name={showPassword ? "eye" : "eye-with-line"}
              size={24}
              color="#414042"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={"Login"}
          color={"#414042"}
          titleStyle={{ fontSize: hp(1.8), fontFamily: "kodchasan-light" }}
          buttonStyle={{
            height: hp(6),
          }}
          containerStyle={{
            borderRadius: wp(3),
            width: wp(30),
            height: hp(6),
            elevation: 5,
          }}
          onPress={signIn}
        />
      </View>
      <View style={{ flexDirection: "row", marginTop: hp(19) }}>
        <Text style={styles.registerText}>Don't have an account yet? </Text>
        <TouchableOpacity onPress={handleRegisterPress}>
          <Text
            style={[
              styles.registerText,
              { fontFamily: "kodchasan-bold", marginTop: hp(4.9) },
            ]}
          >
            Register here!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  buttonContainer: {},
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    marginTop: hp(20),
    alignContent: "center",
    justifyContent: "center",
  },
  logo: {
    paddingBottom: hp(10),
  },
  logoTitle: {
    fontFamily: "kodchasan-bold",
    fontSize: wp(6.5),
    color: "#414042",
    alignSelf: "center",
  },
  textInputContainer: {
    fontFamily: "kodchasan-light",
    fontSize: wp(4),
    color: "#414042",
    alignSelf: "center",
    padding: hp(2),
  },
  inputField: {
    fontFamily: "kodchasan-semibold",
    width: wp("65%"),
    height: hp(6),
    borderWidth: wp(0.3),
    borderColor: "#414042",
    borderRadius: wp("2.5%"),
    marginTop: hp("3%"),
    marginHorizontal: wp(4),
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1%"),
    backgroundColor: "#FFFFFF",
    fontSize: wp("4%"),
  },
  registerText: {
    fontFamily: "kodchasan-medium",
    fontSize: wp(3.5),
    color: "#414042",
    marginTop: hp(5),
    marginBottom: hp(20),
  },
});
