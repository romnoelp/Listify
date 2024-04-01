import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SvgXml } from "react-native-svg";
import { landingScreenLogo, mainButtonLogo } from "../loadSVG";

interface Props {
  onDeleteAllItemsPress: () => void;
  onAddItemsPress: () => void;
  onCompleteAllItemsPress: () => void;
}

const FloatingButton: React.FC<Props> = ({
  onDeleteAllItemsPress,
  onAddItemsPress,
  onCompleteAllItemsPress,
}) => {
  const [animation] = useState(new Animated.Value(0));
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    const toValue = open ? 0 : 1;
    setOpen(!open);

    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const deleteAllItemStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 100],
        }),
      },
    ],
  };

  const finishAllItemStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -100],
        }),
      },
    ],
  };

  const addItemStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -70],
        }),
      },
    ],
  };

  const rotation = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1.2],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  return (
    <View style={[styles.container]}>
      <TouchableWithoutFeedback onPress={() => onDeleteAllItemsPress()}>
        <Animated.View
          style={[
            styles.button,
            styles.secondary,
            styles.menu,
            deleteAllItemStyle,
          ]}
        >
          <Entypo name="trash" size={25} color="#EBF7F9" />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => onCompleteAllItemsPress()}>
        <Animated.View
          style={[
            styles.button,
            styles.secondary,
            styles.menu,
            finishAllItemStyle,
          ]}
        >
          <Entypo name="flag" size={25} color="#EBF7F9" />
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => onAddItemsPress()}>
        <Animated.View
          style={[styles.button, styles.secondary, styles.menu, addItemStyle]}
        >
          <Entypo name="plus" size={24} color="#EBF7F9" />
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={toggleMenu}>
        <Animated.View style={[styles.button, styles.menu, rotation]}>
          <SvgXml xml={mainButtonLogo} />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default FloatingButton;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "absolute",
    bottom: hp("7%"),
    right: wp("8%"),
  },
  button: {
    position: "absolute",
    top: hp(2),
    width: hp("7%"),
    height: hp("7%"),
    borderRadius: hp("20"),
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  menu: {
    backgroundColor: "#414042",
  },
  secondary: {
    width: hp("5%"),
    height: hp("5%"),
    borderRadius: hp("20"),
  },
});
