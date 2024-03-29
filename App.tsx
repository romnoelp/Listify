import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LandingScreen from "./screens/LandingScreen";
import { MainStackParamList } from "./types";

const MainStack = createNativeStackNavigator<MainStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <MainStack.Navigator initialRouteName="LandingScreen">
        <MainStack.Screen
          name="LandingScreen"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <MainStack.Screen name="LoginScreen" component={LoginScreen} />
        <MainStack.Screen name="RegisterScreen" component={RegisterScreen} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
