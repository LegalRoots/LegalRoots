import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserDrawer from "./UserDrawer";
import CasePage from "../screens/client/CasePage";
import Scheduler from "../screens/client/Scheduler";
import ChatAI from "../screens/client/ChatAI";
import ChatScreen from "../screens/client/ChatScreen";
import LawyerDrawer from "./LawyerDrawyer";
import { Ionicons } from "@expo/vector-icons";
import LawyerProfileSettings from "../screens/lawyer/ProfileSettings";
import UserProfileSettings from "../screens/client/ProfileSettings";
import Notifications from "../screens/public/Notifications";
import { AuthContext } from "../src/shared/context/auth";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileWrapper = ({ userType }) => {
  return userType === "User" ? (
    <UserProfileSettings />
  ) : (
    <LawyerProfileSettings />
  );
};
export const BottomTabs = ({ userType }) => {
  const { user, type } = React.useContext(AuthContext);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Notifications") {
            iconName = focused
              ? "notifications"
              : "notifications-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Profile"
        options={{
          headerShown: true,
        }}
        children={() => <ProfileWrapper userType={userType} />}
      />
      <Tab.Screen
        name="Home"
        children={() => <MainStack userType={userType} />}
      />

      <Tab.Screen
        name="Notifications"
        options={{
          headerShown: true,
        }}
        children={() => <Notifications userId={user._id} />}
      />
    </Tab.Navigator>
  );
};

const MainStack = ({ userType }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userType === "User" && (
        <Stack.Screen name="User" component={UserDrawer} />
      )}
      {userType === "Lawyer" && (
        <Stack.Screen name="Lawyer" component={LawyerDrawer} />
      )}
      <Stack.Screen name="CasePage" component={CasePage} />
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
