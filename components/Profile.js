import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile(props) {
  const { user } = props;
  const {
    name: { first, last },
    emailAddress,
  } = user;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.text}>First name</Text>
        <View style={styles.right}>
          <Text style={[styles.text, styles.name]}>{first} </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.text}>Last name</Text>
        <View style={styles.right}>
          <Text style={[styles.text, styles.name]}>{last} </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.text}>Email Address</Text>
        <View style={styles.right}>
          <Text style={[styles.text, styles.name]}>{emailAddress} </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: 60,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  right: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  text: {
    color: "#161616",
    fontSize: 15,
  },
  name: {
    color: "rgba(0,0,0,0.5)",
    fontSize: 18,
    fontWeight: "700",
  },
});
