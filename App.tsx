import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import LandingScreen from "./screens/LandingScreen";
import SplashScreen from "./screens/SplashScreen";
import TaskScreen from "./screens/TaskScreen";
import { loadFont } from "./loadFont";
import { SvgXml } from "react-native-svg";
import { landingScreenLogo } from "./loadSVG";
import NotificationsModal from "./components/NotificationsModal";
import OptionsModal from "./components/OptionsModal";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import OngoingScreen from "./screens/OngoingScreen";
import OverdueScreen from "./screens/OverdueScreen";
import CompletedScreen from "./screens/CompletedScreen";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { MainStackParamList, MainTopTabParamlist } from "./types";
import DevelopersScreen from "./screens/DevelopersScreen";
import AboutAppScreen from "./screens/AboutAppScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ToDoTaskProvider } from "./context/toDoTaskContext";

const MainStack = createNativeStackNavigator<MainStackParamList>();

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
            fontSize: wp(4),
          },
          tabBarStyle: {
            borderBottomColor: "#414042",
            borderBottomWidth: wp(0.3),
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
            fontSize: wp(3.9),
          },
          tabBarStyle: {
            borderBottomColor: "#414042",
            borderBottomWidth: wp(0.2),
            width: "100%",
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
            fontSize: wp(4),
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
          title: "Finished",
          tabBarLabelStyle: {
            textTransform: "none",
            fontFamily: "kodchasan-semibold",
            fontSize: wp(4),
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

const TopNavigator = createMaterialTopTabNavigator<MainTopTabParamlist>();

const App = () => {
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [isNotificationsModalVisible, setIsNotificationsModalVisible] =
    useState(false);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  useEffect(() => {
    if (!isFontLoaded) {
      loadFont().then(() => setIsFontLoaded(true));
    }
  }, []);

  const toggleNotificationsModal = () => {
    setIsNotificationsModalVisible(!isNotificationsModalVisible);
  };

  const toggleOptionsModal = () => {
    setIsOptionsModalVisible(!isOptionsModalVisible);
  };

  return (
    <ToDoTaskProvider>
      <NavigationContainer>
        <MainStack.Navigator initialRouteName="SplashScreen">
          <MainStack.Screen
            name="LandingScreen"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="MainTopTab"
            component={MainTopTab}
            options={{
              title: "Listify",
              headerTitleStyle: {
                fontFamily: "kodchasan-semibold",
                fontSize: wp(6),
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
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={toggleNotificationsModal}
                    style={{ marginRight: wp(4) }}
                  >
                    <Entypo name="bell" size={26} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={toggleOptionsModal}>
                    <Entypo
                      name="dots-three-vertical"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              ),
            }}
          />
          <MainStack.Screen
            name="DevelopersScreen"
            component={DevelopersScreen}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="AboutAppScreen"
            component={AboutAppScreen}
            options={{ headerShown: false }}
          />
        </MainStack.Navigator>
        <NotificationsModal
          isVisible={isNotificationsModalVisible}
          onClose={toggleNotificationsModal}
        />
        <OptionsModal
          isVisible={isOptionsModalVisible}
          onClose={toggleOptionsModal}
        />
      </NavigationContainer>
    </ToDoTaskProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
