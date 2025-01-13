import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import UserDrawer from "./UserDrawer";

const Stack = createNativeStackNavigator();

const MainStack = ({ userType }) => {
  console.log(userType);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userType === "User" && (
        <Stack.Screen name="User" component={UserDrawer} />
      )}
    </Stack.Navigator>
  );
};

export default MainStack;
