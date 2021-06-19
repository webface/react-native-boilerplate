import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import DocumentListing from "../components/DocumentListing";
import RoundedButton from "../components/RoundedButton";
import { Entypo } from "@expo/vector-icons";

export const DOCUMENTS_QUERY = gql`
  query documents {
    documents {
      _id
      title
      createdAt
      content
      status
    }
  }
`;

const { width, height } = Dimensions.get("window");
export default function HomeScreen({ navigation, route }) {
  const { data, refetch, error, loading } = useQuery(DOCUMENTS_QUERY, {
    variables: {},
    fetchPolicy: "cache-and-network",
  });

  if (loading || !data || !data.documents) {
    return <ActivityIndicator style={{ ...StyleSheet.absoluteFillObject }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <RoundedButton
          text="New Document"
          textColor="#FFFFFF"
          backgroundColor="rgba(75, 148, 214, 1)"
          onPress={() => {
            navigation.navigate("AddEdit", {
              mode: "new",
              document: {
                _id: null,
                title: "",
                createdAt: "",
                content: "",
                status: "published",
              },
            });
          }}
          icon={
            <Entypo
              name="squared-plus"
              size={20}
              color={"#FFFFFF"}
              style={styles.newIcon}
            />
          }
        />
      </View>

      <FlatList
        data={data.documents}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollContent}
        renderItem={({ item, index }) => (
          <DocumentListing
            key={item._id}
            document={item}
            onPress={() => navigation.navigate("Detail", { document: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
    flexDirection: "column",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  buttonContainer: {
    paddingHorizontal: 15,
  },
  scrollContent: {
    paddingTop: 10,
    width: width,
  },
  newIcon: {
    position: "relative",
    left: 20,
    zIndex: 8,
  },
});
