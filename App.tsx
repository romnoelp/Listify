import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LandingScreen from "./screens/LandingScreen";
import { MainStackParamList, MainTopTabParamlist } from "./types";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TaskScreen from "./screens/TaskScreen";
import OngoingScreen from "./screens/OngoingScreen";
import OverdueScreen from "./screens/OverdueScreen";
import CompletedScreen from "./screens/CompletedScreen";
import { loadFont } from "./loadFont";
import { SvgXml } from "react-native-svg";
import { landingScreenLogo } from "./loadSVG";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Entypo } from "@expo/vector-icons";

const MainStack = createNativeStackNavigator<MainStackParamList>();
const TopNavigator = createMaterialTopTabNavigator<MainTopTabParamlist>();

const MainTopTab = () => {
  return (
    <TopNavigator.Navigator>
      <TopNavigator.Screen
        name="TaskScreen"
        component={TaskScreen}
        options={{
          title: "All",
          tabBarLabelStyle: {
            textTransform: "none",
            fontFamily: "kodchasan-semibold",
          },
          tabBarStyle: {
            borderBottomColor: "#414042",
            borderBottomWidth: wp(0.2),
          },
          tabBarIndicator: () => <></>,
        }}
      />
      <TopNavigator.Screen
        name="OngoingScreen"
        component={OngoingScreen}
        options={{
          title: "On Going",
          tabBarLabelStyle: {
            textTransform: "none",
            fontFamily: "kodchasan-semibold",
          },
          tabBarStyle: {
            borderBottomColor: "#414042",
            borderBottomWidth: wp(0.2),
          },
          tabBarIndicator: () => <></>,
        }}
      />
      <TopNavigator.Screen
        name="OverdueScreen"
        component={OverdueScreen}
        options={{
          title: "Overdue",
          tabBarLabelStyle: {
            textTransform: "none",
            fontFamily: "kodchasan-semibold",
          },
          tabBarStyle: {
            borderBottomColor: "#414042",
            borderBottomWidth: wp(0.2),
          },
          tabBarIndicator: () => <></>,
        }}
      />
      <TopNavigator.Screen
        name="CompletedScreen"
        component={CompletedScreen}
        options={{
          title: "Completed",
          tabBarLabelStyle: {
            textTransform: "none",
            fontFamily: "kodchasan-semibold",
          },
          tabBarStyle: {
            borderBottomColor: "#414042",
            borderBottomWidth: wp(0.2),
          },
          tabBarIndicator: () => <></>,
        }}
      />
    </TopNavigator.Navigator>
  );
};

const App = () => {
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  useEffect(() => {
    if (!isFontLoaded) {
      loadFont().then(() => setIsFontLoaded(true));
    }
  }, []);
  return (
    <NavigationContainer>
      <MainStack.Navigator initialRouteName="MainTopTab">
        <MainStack.Screen
          name="LandingScreen"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <MainStack.Screen name="LoginScreen" component={LoginScreen} />
        <MainStack.Screen name="RegisterScreen" component={RegisterScreen} />
        <MainStack.Screen
          name="MainTopTab"
          component={MainTopTab}
          options={{
            title: "Listify",
            headerTitleStyle: {
              fontFamily: "kodchasan-semibold",
            },
            headerLeft: () => (
              <SvgXml
                xml={landingScreenLogo}
                height={35}
                width={35}
                style={{ marginRight: wp(2) }}
              />
            ),
            headerRight: () => (
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity style={{ marginRight: wp(4) }}>
                  <Entypo name="bell" size={26} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Entypo name="dots-three-vertical" size={24} color="black" />
                </TouchableOpacity>
              </View>
            ),
          }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
