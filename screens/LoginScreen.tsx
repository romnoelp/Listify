import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { loadFont } from "../loadFont";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { loginScreenLogo } from "../loadSVG";
import { SvgXml } from "react-native-svg";
import { Button } from "@rneui/base";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../types";

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

  useEffect(() => {
    loadFont().then(() => setFontLoaded(true));
  }, []);

  if (!fontLoaded) {
    return null;
  }

  const handleRegisterPress = () => {
    navigation.replace("RegisterScreen"); // Navigate to the RegisterScreen
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
        <TextInput
          style={styles.inputField}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Password"
          placeholderTextColor="#8F8F8F"
        />
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
          onPress={() => navigation.replace("LoginScreen")}
        />
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            fontFamily: "kodchasan-regular",
            fontSize: wp(3.5),
            marginTop: hp(20),
            marginBottom: hp(8),
          }}
        >
          Don't have an account yet?{" "}
          <TouchableOpacity onPress={handleRegisterPress}>
            <Text style={styles.registerText}>Register here!</Text>
          </TouchableOpacity>
        </Text>
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
    lineHeight: hp(1.98), 
  },
});
