import { useLinking } from "@react-navigation/native";
import * as Linking from "expo-linking";

export default function (containerRef) {
  return useLinking(containerRef, {
    prefixes: [Linking.createURL("/")],
    config: {
      Root: {
        path: "root",
        screens: {
          Home: "home",
          Profile: "profile",
        },
      },
    },
  });
}
