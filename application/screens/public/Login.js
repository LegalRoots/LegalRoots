import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useFormik } from "formik";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../../src/shared/context/auth";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
const Login = () => {
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useContext(AuthContext);

  const onSubmit = async (values, actions) => {
    try {
      const { email, password, checkbox, type, ssid } = values;

      const response = await fetch(`${API_URL}/JusticeRoots/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, type, ssid }),
      });

      if (!response.ok) {
        setErrorMessage("Invalid email or password. Please try again.");
        return;
      }

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome to JusticeRoots!",
      });

      const user = await response.json();
      login(user, checkbox, type);

      setErrorMessage("");
      actions.resetForm();
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      email: "",
      password: "",
      checkbox: false,
      type: "User",
      ssid: "",
    },
    onSubmit,
  });

  const isSSIDRequired = ["Lawyer", "Judge", "Admin"].includes(values.type);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.card}>
        <Text style={styles.header}>Welcome to JusticeRoots</Text>
        <Text style={styles.subheader}>Login to continue</Text>
        {errorMessage !== "" && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
        <View style={styles.form}>
          {isSSIDRequired ? (
            <TextInput
              style={styles.input}
              value={values.ssid}
              onChangeText={handleChange("ssid")}
              placeholder="Enter ID"
              placeholderTextColor="#aaa"
            />
          ) : (
            <TextInput
              style={styles.input}
              value={values.email}
              onChangeText={handleChange("email")}
              placeholder="Enter Email"
              keyboardType="email-address"
              placeholderTextColor="#aaa"
            />
          )}
          <TextInput
            style={styles.input}
            value={values.password}
            onChangeText={handleChange("password")}
            placeholder="Enter Password"
            secureTextEntry
            placeholderTextColor="#aaa"
          />
          <Picker
            selectedValue={values.type}
            onValueChange={(itemValue) => setFieldValue("type", itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="User" value="User" />
            <Picker.Item label="Lawyer" value="Lawyer" />
            <Picker.Item label="Judge" value="Judge" />
            <Picker.Item label="Admin" value="Admin" />
          </Picker>
          <TouchableOpacity
            onPress={() => setFieldValue("checkbox", !values.checkbox)}
            style={styles.checkboxContainer}
          >
            <Text style={styles.checkboxText}>
              {values.checkbox ? "☑" : "☐"} Remember Me
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.newHere}>
            New Here?{" "}
            <Text
              style={styles.registerLink}
              onPress={() => navigation.navigate("Signup")}
            >
              Create an Account
            </Text>
          </Text>
        </View>
      </View>
      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 10,
  },
  subheader: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  picker: {
    marginBottom: 10,
    color: "#2c3e50",
  },
  checkboxContainer: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxText: {
    fontSize: 16,
    color: "#34495e",
  },
  loginButton: {
    backgroundColor: "#ffbf00",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#ffbf00",
    textAlign: "center",
    marginTop: 10,
  },
  newHere: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#7f8c8d",
  },
  registerLink: {
    color: "#ffbf00",
    fontWeight: "bold",
  },
  errorText: {
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default Login;
