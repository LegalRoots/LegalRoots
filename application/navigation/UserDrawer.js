import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainFeed from "../screens/client/MainFeed";
import HireLawyer from "../screens/client/HireLawyer";
import { AuthContext } from "../src/shared/context/auth";

import Logout from "../screens/public/Logout";
const Drawer = createDrawerNavigator();

const UserDrawer = () => {
  const { logout } = React.useContext(AuthContext);
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
      <Drawer.Screen name="Hire A Lawyer" component={HireLawyer} />
      <Drawer.Screen name="Logout" component={Logout} />
    </Drawer.Navigator>
  );
};

export default UserDrawer;
