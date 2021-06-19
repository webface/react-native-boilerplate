import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  Alert,
  TextInput,
} from "react-native";
import { useMutation } from "@apollo/react-hooks";
import RoundedButton from "../components/RoundedButton";
import { Ionicons } from "@expo/vector-icons";
import gql from "graphql-tag";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../providers/ToastProvider";
import { DOCUMENTS_QUERY } from "./HomeScreen";

const { width } = Dimensions.get("window");
// Mutations
const CREATE_MUTATION = gql`
  mutation createDocument($document: DocumentInput!) {
    createDocument(document: $document) {
      _id
    }
  }
`;

const UPDATE_MUTATION = gql`
  mutation updateDocument($documentId: ID!, $document: DocumentInput!) {
    updateDocument(documentId: $documentId, document: $document) {
      _id
    }
  }
`;

export default function NewEdit({ navigation, route }) {
  console.log({ newEdit: "NEW/EDIT" });
  const { params } = route;
  const { document, mode } = params;
  const { _id, createdAt, status } = document;
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const { show } = useContext(ToastContext);
  const isNew = mode === "new";
  // Create
  const [create] = useMutation(CREATE_MUTATION, {
    async onCompleted({ createDocument }) {
      const { _id } = createDocument;
      try {
        navigation.push("Detail", {
          document: { _id, title, createdAt, content, status },
        });
      } catch (err) {
        console.log(err.message);
        console.log(err.networkError.result.errors);
      }
    },
    onError({ graphQLErrors, networkError }) {
      show({
        message:
          (networkError?.result?.errors[0] || graphQLErrors[0]).message ||
          "Something went wrong",
      });
    },
    refetchQueries: [{ query: DOCUMENTS_QUERY }],
  });

  // Updating
  const [update] = useMutation(UPDATE_MUTATION, {
    async onCompleted({ updateDocument }) {
      try {
        const { _id } = updateDocument;
        navigation.navigate("Home");
      } catch (err) {
        console.log(err.message);
      }
    },
    onError({ graphQLErrors, networkError }) {
      show({
        message:
          (networkError?.result?.errors[0] || graphQLErrors[0]).message ||
          "Something went wrong",
      });
    },
    refetchQueries: [{ query: DOCUMENTS_QUERY }],
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View>
          <Text>Title</Text>
          <TextInput
            onChangeText={(text) => setTitle(text)}
            value={title}
            placeholder="Title"
            autoCorrect={false}
            autoCapitalize="sentences"
            style={styles.input}
          />
        </View>
        <View>
          <Text>Content</Text>
          <TextInput
            onChangeText={(text) => setContent(text)}
            value={content}
            multiline={true}
            numberOfLines={25}
            placeholder="Content"
            autoCorrect={false}
            autoCapitalize={"sentences"}
            style={styles.input2}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <RoundedButton
          text={isNew ? "Create" : "Update"}
          textColor="#fff"
          backgroundColor="rgba(75, 148, 214, 1)"
          icon={
            <Ionicons
              name="md-checkmark-circle"
              size={20}
              color={"#fff"}
              style={styles.saveIcon}
            />
          }
          onPress={() => {
            if (isNew) {
              create({ variables: { document: { title, content, status } } });
            } else {
              update({
                variables: {
                  documentId: _id,
                  document: { title, content, status },
                },
              });
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  saveIcon: {
    position: "relative",
    left: 20,
    zIndex: 8,
  },
  inputContainer: {
    paddingTop: 10,
    justifyContent: "flex-end",
  },
  buttonContainer: {
    flex: 0.5,
    justifyContent: "space-between",
  },
  input: {
    width: width - 40,
    minHeight: 40,
    borderBottomColor: "#FFF",
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  input2: {
    width: width - 40,
    minHeight: 120,
    borderBottomColor: "#FFF",
    borderBottomWidth: 1,
    marginBottom: 20,
  },
});
