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

const RegisterScreen = ({ navigation }: Props) => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    loadFont().then(() => setFontLoaded(true));
  }, []);

  useEffect(() => {
    if (password !== "" && confirmPassword !== "") {
      setPasswordMatch(password === confirmPassword);
    } else {
      setPasswordMatch(true);
    }
  }, [password, confirmPassword]);

  if (!fontLoaded) {
    return null;
  }

  const handleLoginPress = () => {
    navigation.replace("LoginScreen");
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
          onChangeText={(text) => setName(text)}
          value={name}
          placeholder="Name"
          placeholderTextColor="#8F8F8F"
        />
        <TextInput
          style={styles.inputField}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Email"
          placeholderTextColor="#8F8F8F"
        />
        <TextInput
          style={styles.inputField}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Password"
          placeholderTextColor="#8F8F8F"
          secureTextEntry
        />
        <TextInput
          style={[styles.inputField, !passwordMatch && styles.inputFieldError]}
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          placeholder="Confirm password"
          placeholderTextColor="#8F8F8F"
          secureTextEntry
        />
        {!passwordMatch && (
          <Text style={styles.errorText}>Passwords do not match</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={"Register"}
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
          onPress={() => navigation.replace("RegisterScreen")}
        />
      </View>
      <View style={{ flexDirection: "row", marginTop: hp(10) }}>
        <Text style={styles.registerText}>Already have an account? </Text>
        <TouchableOpacity onPress={handleLoginPress}>
          <Text
            style={[
              styles.registerText,
              { fontFamily: "kodchasan-bold", marginTop: hp(4.9) },
            ]}
          >
            Login here!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;

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
  inputFieldError: {
    borderColor: "red",
  },
  errorText: {
    fontFamily: "kodchasan-medium",
    fontSize: wp(3.5),
    color: "red",
    marginTop: hp(1),
  },
  registerText: {
    fontFamily: "kodchasan-medium",
    fontSize: wp(3.5),
    color: "#414042",
    marginTop: hp(5),
    marginBottom: hp(20),
  },
});
