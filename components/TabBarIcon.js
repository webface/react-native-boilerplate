import * as React from "react";
import { Ionicons, Entypo } from "@expo/vector-icons";

import Colors from "../constants/Colors";
import { View } from "react-native";

export default function TabBarIcon(props) {
  const isEntypo = props.type === "entypo";
  return (
    <View>
      {isEntypo ? (
        <Entypo
          name={props.name}
          size={30}
          style={{ marginBottom: -3 }}
          color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        />
      ) : (
        <Ionicons
          name={props.name}
          size={30}
          style={{ marginBottom: -3 }}
          color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        />
      )}
    </View>
  );
}
