import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainFeed from "../screens/client/MainFeed";
import HireLawyer from "../screens/client/HireLawyer";
import { AuthContext } from "../src/shared/context/auth";
import UserCases from "../screens/client/UserCases";
import Logout from "../screens/public/Logout";
import PayLawyer from "../screens/client/PayLawyer";
import ProfileSettings from "../screens/client/ProfileSettings";
import Chats from "../screens/client/Chats";

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
      <Drawer.Screen name="My Cases" component={UserCases} />
      <Drawer.Screen name="Pay Lawyer" component={PayLawyer} />
      <Drawer.Screen name="Profile Settings" component={ProfileSettings} />
      <Drawer.Screen name="Chats" component={Chats} />
      <Drawer.Screen name="Logout" component={Logout} />
    </Drawer.Navigator>
  );
};

export default UserDrawer;
