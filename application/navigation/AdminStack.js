import React from "react";
import { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Logout from "../screens/public/Logout";
import Profile from "../screens/admin/Profile";
import Courts from "../screens/admin/Courts";
import Employees from "../screens/admin/Employees";
import Judges from "../screens/admin/Judges";
import Cases from "../screens/admin/Cases";
import CaseTypes from "../screens/admin/CaseTypes";
import JudgeProfile from "../screens/admin/JudgeProfile";
import { AuthContext } from "../src/shared/context/auth";

const Drawer = createDrawerNavigator();

const AdminStack = () => {
  const { user, type } = useContext(AuthContext);

  return (
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
      {type === "Admin" && (
        <Drawer.Screen
          name="profile"
          component={Profile}
          options={{ title: "Profile" }} // Displayed name in drawer
        />
      )}
      {type === "Judge" && (
        <Drawer.Screen
          name="profile"
          component={JudgeProfile}
          options={{ title: "Profile" }} // Displayed name in drawer
        />
      )}
      {type === "Admin" && (
        <Drawer.Screen
          name="employees"
          component={Employees}
          options={{ title: "Employees" }} // Custom title
        />
      )}
      {type === "Admin" && (
        <Drawer.Screen
          name="judges"
          component={Judges}
          options={{ title: "Judges" }} // Custom title
        />
      )}
      <Drawer.Screen
        name="courts"
        component={Courts}
        options={{ title: "Courts" }} // Custom title
      />

      <Drawer.Screen
        name="cases"
        component={Cases}
        options={{ title: "Cases" }} // Custom title
      />
      <Drawer.Screen
        name="caseTypes"
        component={CaseTypes}
        options={{ title: "Case Types" }} // Custom title
      />
      <Drawer.Screen
        name="Logout"
        component={Logout}
        options={{ title: "Logout" }} // Custom title
      />
    </Drawer.Navigator>
  );
};

export default AdminStack;
