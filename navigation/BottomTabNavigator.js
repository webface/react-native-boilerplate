import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import DocumentDetail from "../screens/DocumentDetail";
import NewEdit from "../screens/NewEdit";

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Home";

function HomeStack() {
  const { signOut } = React.useContext(AuthContext);
  const options = ({ navigation }) => ({
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
          await signOut();
        }}
      />
    ),
  });
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={options} />
      <Stack.Screen
        name="Detail"
        component={DocumentDetail}
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
                await signOut();
              }}
            />
          ),
          headerLeft: () => (
            <Ionicons
              name="home"
              size={25}
              color="#161616"
              style={{
                position: "relative",
                left: 20,
                zIndex: 8,
              }}
              onPress={async () => {
                navigation.navigate("Home");
              }}
            />
          ),
        })}
      />
      <Stack.Screen name="AddEdit" component={NewEdit} options={options} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  const { signOut } = React.useContext(AuthContext);
  const options = ({ navigation }) => ({
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
          await signOut();
        }}
      />
    ),
  });
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={options}
      />
    </Stack.Navigator>
  );
}

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation, route]);
  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: "My Documents",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon type="entypo" focused={focused} name="text-document" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-person" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case "Home":
      return "Now Playing";
    case "Profile":
      return "Profile";
  }
}
