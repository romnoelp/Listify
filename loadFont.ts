import * as Font from "expo-font";

const loadFont = async () => {
  return await Font.loadAsync({
    "kodchasan-extralight": require("./fonts/Kodchasan-ExtraLight.ttf"),
    "kodchasan-light": require("./fonts/Kodchasan-Light.ttf"),
    "kodchasan-regular": require("./fonts/Kodchasan-Regular.ttf"),
    "kodchasan-medium": require("./fonts/Kodchasan-Medium.ttf"),
    "kodchasan-semibold": require("./fonts/Kodchasan-SemiBold.ttf"),
    "kodchasan-bold": require("./fonts/Kodchasan-Bold.ttf"),
  });
};

export { loadFont };
