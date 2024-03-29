import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

{
  /* Screens*/
}
import LandingScreen from "./screens/LandingScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="LandingScreen"
        component={LandingScreen}
        options={{ headerShown: false, statusBarHidden: true }}
      />
    </Stack.Navigator>
  </NavigationContainer>;
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
