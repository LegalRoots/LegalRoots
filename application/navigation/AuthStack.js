import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/public/Login";
import Signup from "../screens/public/Signup";

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen
      options={{
        title: "Signup",
        headerStyle: { backgroundColor: "#ffbf00" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
      name="Signup"
      component={Signup}
    />
  </Stack.Navigator>
);

export default AuthStack;
