import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { landingScreenLogo } from "../loadSVG";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { loadFont } from "../loadFont";
import { Button } from "@rneui/base";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../types";

type LandingScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  "LandingScreen"
>;

type Props = {
  navigation: LandingScreenNavigationProp;
};

const LandingScreen = ({ navigation }: Props) => {
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  useEffect(() => {
    if (!isFontLoaded) {
      loadFont().then(() => setIsFontLoaded(true));
    }
  });
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      {isFontLoaded ? (
        <View>
          <View
            style={{
              alignItems: "center",
            }}
          >
            <SvgXml xml={landingScreenLogo} height={80} width={80} />
            <Text
              style={{
                marginTop: hp(3),
                fontFamily: "kodchasan-bold",
                fontSize: hp(3),
              }}
            >
              Listify
            </Text>
            <Text
              style={{
                marginHorizontal: wp(25),
                textAlign: "center",
                fontFamily: "kodchasan-light",
                fontSize: hp(1.8),
              }}
            >
              “Subtracting from your list of priorities is as important as
              adding to it.”
            </Text>
            <Text
              style={{
                fontFamily: "kodchasan-medium",
                fontSize: hp(1.5),
                marginTop: wp(2),
              }}
            >
              - Frank Sonnenberg
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: hp(3),
              justifyContent: "space-evenly",
              alignItems: "center",
              marginHorizontal: wp(15),
            }}
          >
            <Button
              title={"Login"}
              color={"#414042"}
              titleStyle={{ fontSize: hp(1.8), fontFamily: "kodchasan-light" }}
              containerStyle={{
                borderRadius: wp(2),
                shadowColor: "#000",
                elevation: 5,
                flex: 0.5,
                marginRight: wp(10),
              }}
              onPress={() => navigation.replace("LoginScreen")}
            />
            <Button
              title={"Register"}
              color={"#FFFFFF"}
              containerStyle={{
                borderRadius: wp(2),
                shadowColor: "#000",
                elevation: 5,
                flex: 0.5,
              }}
              titleStyle={{
                fontSize: hp(1.8),
                fontFamily: "kodchasan-light",
                color: "black",
              }}
              onPress={() => navigation.replace("RegisterScreen")}
            />
          </View>
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({});
