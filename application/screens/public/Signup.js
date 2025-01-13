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
const Signup = () => {
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState("");

  return <Text>Signup</Text>;
};
export default Signup;
