import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function DocumentListing(props) {
  const {
    document,
    document: { title, createdAt },
    onPress,
  } = props;
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress()}
    >
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{createdAt}</Text>
      </View>
      <MaterialIcons
        name="pageview"
        size={32}
        color="rgba(75, 148, 214, 1)"
        style={styles.viewIcon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width,
    paddingVertical: 10,
    borderBottomColor: "rgba(75, 148, 214, 1)",
    borderBottomWidth: 1,
  },
  textWrapper: {
    flex: 1,
    paddingStart: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  date: {
    fontSize: 10,
    marginTop: 4,
  },
  viewIcon: {
    position: "relative",
    right: 20,
    zIndex: 8,
  },
});
