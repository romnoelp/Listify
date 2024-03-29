import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { landingScreenLogo } from "../loadSVG";
import { SvgXml } from "react-native-svg";

const LandingScreen = () => {
  return (
    <View style={styles.mainContainer}>
      <SvgXml xml={landingScreenLogo} style={styles.logo} />
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: wp("10%"),
    width: wp("10%"),
  },
});
