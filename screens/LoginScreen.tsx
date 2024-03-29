import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { loginScreenLogo } from "../loadSVG";
import { SvgXml } from "react-native-svg";

const LoginScreen = () => {
  return (
    <View style={styles.mainContainer}>
      <SvgXml xml={loginScreenLogo} style={styles.logo} />
      <Text>Listify</Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {},
});
