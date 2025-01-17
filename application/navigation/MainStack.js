import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import UserDrawer from "./UserDrawer";
import CasePage from "../screens/client/CasePage";
import Scheduler from "../screens/client/Scheduler";
import ChatAI from "../screens/client/ChatAI";
import ChatScreen from "../screens/client/ChatScreen";
import LawyerDrawer from "./LawyerDrawyer";

const Stack = createNativeStackNavigator();

const MainStack = ({ userType }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userType === "User" && (
        <Stack.Screen name="User" component={UserDrawer} />
      )}
      {userType === "Lawyer" && (
        <Stack.Screen name="Lawyer" component={LawyerDrawer} />
      )}
      <Stack.Screen
        name="CasePage"
        options={{
          headerShown: true,
          title: "Case Detail",
        }}
        component={CasePage}
      />
      <Stack.Screen
        name="Scheduler"
        options={{
          headerShown: true,
          title: "Scheduler",
        }}
        component={Scheduler}
      />
      <Stack.Screen
        name="ChatScreen"
        options={{
          headerShown: true,
          title: "Chat",
        }}
        component={ChatScreen}
      />

      <Stack.Screen
        name="ChatWithAIBot"
        options={{
          headerShown: true,
          title: "Chat with AI Bot",
        }}
        component={ChatAI}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
