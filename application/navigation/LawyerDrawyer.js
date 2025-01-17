import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainFeed from "../screens/client/MainFeed";
import { AuthContext } from "../src/shared/context/auth";
import Logout from "../screens/public/Logout";
import PendingCases from "../screens/lawyer/PendingCases";
import LawyerCases from "../screens/lawyer/LawyerCases";
import Chats from "../screens/client/Chats";
const Drawer = createDrawerNavigator();

const LawyerDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="MainFeed"
      screenOptions={{
        headerShown: true,
        drawerStyle: { backgroundColor: "#fff", width: 240 },
        headerTitleAlign: "center",
      }}
    >
      <Drawer.Screen name="MainFeed" component={MainFeed} />
      <Drawer.Screen name="Pending Cases" component={PendingCases} />
      <Drawer.Screen name="My Cases" component={LawyerCases} />
      <Drawer.Screen name="Chats" component={Chats} />

      <Drawer.Screen name="Logout" component={Logout} />
    </Drawer.Navigator>
  );
};

export default LawyerDrawer;
