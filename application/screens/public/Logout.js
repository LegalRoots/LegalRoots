import React, { useContext } from "react";
import { Alert, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Cookies from "js-cookie";
import { AuthContext } from "../../src/shared/context/auth";

const Logout = ({ navigation }) => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("userType");
      await AsyncStorage.removeItem("token");
      Cookies.remove("token");
      logout();
      Alert.alert("Success", "You have been logged out.");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Are you sure?",
      "Do you really want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Yes", onPress: handleLogout },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Out</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    marginBottom: 40,
    fontWeight: "600",
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#FF4C4C",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Logout;
