import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Profile from "../components/Profile";

// Current User Query
const PROFILE_QUERY = gql`
  query {
    user {
      _id
      name {
        first
        last
      }
      emailAddress
    }
  }
`;

export default function ProfileScreen({ route, navigation }) {
  const { data, loading, error } = useQuery(PROFILE_QUERY, {
    fetchPolicy: "network-only",
  });
  if (!data || !data.user) {
    return <ActivityIndicator style={{ ...StyleSheet.absoluteFillObject }} />;
  }
  const { user } = data;
  //const { name, emailAddress } = user;
  return (
    <View style={styles.container}>
      <Profile user={user} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff",
  },
  saveIcon: {
    position: "relative",
    right: 20,
    zIndex: 8,
  },
});
