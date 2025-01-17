import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AdminDashboard from "../screens/Admin/AdminDashboard";
import { AuthContext } from "../src/shared/context/auth";
import Logout from "../screens/public/Logout";
const Drawer = createDrawerNavigator();

const AdminStack = () => (
  <Drawer.Navigator
    initialRouteName="profile"
    screenOptions={{
      headerStyle: { backgroundColor: "#222" },
      headerTintColor: "#fff",
      drawerActiveBackgroundColor: "#333",
      drawerActiveTintColor: "#fff",
      drawerInactiveTintColor: "#fff",
      drawerStyle: { backgroundColor: "#222", color: "white" },
    }}
  >
    {/* <Drawer.Screen name="profile" component={Profile} />
    <Drawer.Screen name="employees" component={Employees} />
    <Drawer.Screen name="courts" component={Courts} />
    <Drawer.Screen name="judges" component={Judges} />
    <Drawer.Screen name="cases" component={Cases} />
    <Drawer.Screen name="caseTypes" component={CaseTypes} /> */}

    <Drawer.Screen name="Logout" component={Logout} />
  </Drawer.Navigator>
);

export default AdminStack;
