import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { logo } from "../loadSVG";
import { SvgXml } from "react-native-svg";

const LandingScreen = () => {
    return (
      <View style={styles.mainContainer}>
        <SvgXml xml={logo}  />
      </View>
    );
};

export default LandingScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignContent: "center",
    justifyContent: "center",
  },
});
