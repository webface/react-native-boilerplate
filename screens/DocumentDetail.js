import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import Button from "../components/Button";
import { Entypo, AntDesign } from "@expo/vector-icons";
const { width } = Dimensions.get("window");
export default function DocumentDetail({ route, navigation }) {
  const { params } = route;
  const { document } = params;
  const { _id, title, createdAt, content, status } = document;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statRow}>
          <Text style={[styles.stat]}>{title}</Text>
        </View>

        <Image
          style={styles.image}
          source={{ uri: "https://source.unsplash.com/random/1024*768" }}
        />

        <View style={styles.statRow}>
          <Text style={styles.stat}>{content}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.stat}>Date</Text>
          <Text style={styles.stat}>{createdAt}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            text="Edit"
            textColor="#FFFFFF"
            backgroundColor="rgba(75, 148, 214, 1)"
            onPress={() => {
              navigation.push("AddEdit", {
                document: document,
                mode: "edit",
              });
            }}
            icon={
              <Entypo
                name="edit"
                size={20}
                color={"#FFFFFF"}
                style={styles.icon}
              />
            }
          />

          <Button
            text="Delete"
            textColor="#FFFFFF"
            backgroundColor="rgba(75, 148, 214, 1)"
            onPress={() => {}}
            icon={
              <AntDesign
                name="delete"
                size={20}
                color={"#FFFFFF"}
                style={styles.icon}
              />
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",

    flex: 1,
  },
  text: {
    fontSize: 32,
    color: "#161616",
    paddingBottom: 15,
  },
  image: {
    width: width,
    height: width / 2,
    resizeMode: "cover",
  },
  statRow: {
    width: "100%",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    color: "#161616",
    fontSize: 16,
    fontWeight: "500",
  },
  icon: {
    position: "relative",
    left: 20,
    zIndex: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
});