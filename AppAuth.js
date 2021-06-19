import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import useLinking from "./hooks/useLinking";
import { ApolloProvider } from "@apollo/react-hooks";
import client from "./ApolloClient";
import * as SecureStore from "expo-secure-store";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import { AuthContext } from "./context/AuthContext";
import { ToastProvider } from "./providers/ToastProvider";
import Toast from "./providers/Toast";
import BottomTabNavigator from "./navigation/BottomTabNavigator";

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync("userToken");
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async ({ token }) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        try {
          await SecureStore.setItemAsync("userToken", token);
        } catch (e) {}

        dispatch({ type: "SIGN_IN", token: token });
      },
      signOut: async () => {
        await SecureStore.deleteItemAsync("userToken");
        dispatch({ type: "SIGN_OUT" });
      },
      signUp: async ({ token }) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        try {
          await SecureStore.setItemAsync("userToken", token);
        } catch (e) {}
        dispatch({ type: "SIGN_IN", token: token });
      },
    }),
    []
  );
  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <ToastProvider>
        <Toast />
        <ApolloProvider client={client}>
          <AuthContext.Provider value={authContext}>
            <View style={styles.container}>
              {Platform.OS === "ios" && <StatusBar barStyle="default" />}
              <NavigationContainer
                ref={containerRef}
                initialState={initialNavigationState}
              >
                <Stack.Navigator>
                  {state.userToken == null ? (
                    <Stack.Screen name="Login" component={LoginScreen} />
                  ) : (
                    <Stack.Screen
                      name="Root"
                      component={BottomTabNavigator}
                      options={({ navigation }) => ({
                        headerRight: () => (
                          <Ionicons
                            name="md-exit"
                            size={25}
                            color="#161616"
                            style={{
                              position: "relative",
                              right: 20,
                              zIndex: 8,
                            }}
                            onPress={async () => {
                              await authContext.signOut();
                            }}
                          />
                        ),
                      })}
                    />
                  )}
                </Stack.Navigator>
              </NavigationContainer>
            </View>
          </AuthContext.Provider>
        </ApolloProvider>
      </ToastProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
