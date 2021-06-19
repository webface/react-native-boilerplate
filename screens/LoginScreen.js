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

const { width } = Dimensions.get("window");
// Mutations
const SIGN_UP_MUTATION = gql`
  mutation signup($user: UserInput) {
    signup(user: $user) {
      token
    }
  }
`;

const SIGN_IN_MUTATION = gql`
  mutation login($emailAddress: String!, $password: String!) {
    login(emailAddress: $emailAddress, password: $password) {
      token
    }
  }
`;

export default function LoginScreen({ navigation, route }) {
  console.log({ login: "LOGIN" });
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(true);
  const { signIn: setToken } = React.useContext(AuthContext);
  const { show } = useContext(ToastContext);
  // Signing In
  const [signIn] = useMutation(SIGN_IN_MUTATION, {
    async onCompleted({ login }) {
      const { token } = login;
      try {
        await setToken({ token });
        //navigation.replace("Profile");
      } catch (err) {
        console.log(err.message);
        console.log(err.networkError.result.errors);
      }
    },
    onError({ graphQLErrors, networkError }) {
      //console.log(JSON.stringify(error));
      show({
        message:
          (networkError?.result?.errors[0] || graphQLErrors[0]).message ||
          "Something went wrong",
      });
    },
  });

  // Signing Up
  const [signUp] = useMutation(SIGN_UP_MUTATION, {
    async onCompleted({ signup }) {
      const { token } = signup;
      try {
        await setToken({ token });
        //await AsyncStorage.setItem("token", token);
        //navigation.replace("Profile");
      } catch (err) {
        console.log(err.message);
      }
    },
    onError({ graphQLErrors, networkError }) {
      //console.log(JSON.stringify(error));
      show({
        message:
          (networkError?.result?.errors[0] || graphQLErrors[0]).message ||
          "Something went wrong",
      });
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {login ? null : (
          <React.Fragment>
            <View>
              <Text>Firstname</Text>
              <TextInput
                onChangeText={(text) => setFirstname(text)}
                value={firstname}
                placeholder="Firstname"
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            <View>
              <Text>Lastname</Text>
              <TextInput
                onChangeText={(text) => setLastname(text)}
                value={lastname}
                placeholder="Lastname"
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
          </React.Fragment>
        )}
        <View>
          <Text>{login ? "Email or Username" : "Email"}</Text>
          <TextInput
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder={login ? "Email or Username" : "Email"}
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
        <View>
          <Text>Password</Text>
          <TextInput
            onChangeText={(text) => setPassword(text)}
            value={password}
            placeholder="Password"
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.input}
            secureTextEntry
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <RoundedButton
          text={login ? "Login" : "Sign Up"}
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
            // email validation (is valid email?)
            if (login) {
              const isEmail = email.includes("@");
              const res = isEmail
                ? signIn({ variables: { emailAddress: email, password } })
                : signIn({ variables: { username: email, password } });
            } else {
              signUp({
                variables: {
                  user: {
                    name: { first: firstname, last: lastname },
                    emailAddress: email,
                    password,
                  },
                },
              });
            }
          }}
        />
        <RoundedButton
          text={login ? "Need an account? Sign up" : "Have an account? Log in"}
          textColor="rgba(75, 148, 214, 1)"
          backgroundColor="#fff"
          onPress={() => setLogin(!login)}
          icon={
            <Ionicons
              name="md-information-circle"
              size={20}
              color="rgba(75, 148, 214, 1)"
              style={styles.saveIcon}
            />
          }
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
    flex: 0.5,
    justifyContent: "flex-end",
  },
  buttonContainer: {
    flex: 0.5,
    justifyContent: "space-between",
  },
  input: {
    width: width - 40,
    height: 40,
    borderBottomColor: "#FFF",
    borderBottomWidth: 1,
    marginBottom: 20,
  },
});
