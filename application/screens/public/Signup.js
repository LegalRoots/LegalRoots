import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import {
  TextInput,
  Button,
  RadioButton,
  Menu,
  Provider,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

const SignUp = () => {
  const [userType, setUserType] = useState("User");
  const [gender, setGender] = useState("male");
  const [specialization, setSpecialization] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    SSID: "",
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    city: "",
    street: "",
    description: "",
    years_of_experience: "",
    cv: "",
    practicing_certificate: "",
  });

  const handleSubmit = () => {
    // Submit logic here
    console.log(formData);
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    setDate(currentDate);
    setShow(false);
  };
  const showDatepicker = () => {
    setShow(true);
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>

      <TextInput
        label="SSID"
        value={formData.SSID}
        onChangeText={(text) => setFormData({ ...formData, SSID: text })}
        style={styles.input}
      />
      <TextInput
        label="First Name"
        value={formData.firstName}
        onChangeText={(text) => setFormData({ ...formData, firstName: text })}
        style={styles.input}
      />
      <TextInput
        label="Last Name"
        value={formData.lastName}
        onChangeText={(text) => setFormData({ ...formData, lastName: text })}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Birthday"
        value={date.toLocaleDateString()}
        onFocus={showDatepicker}
        style={styles.input}
      />

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
      <TextInput
        label="Phone"
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <RadioButton.Group onValueChange={setGender} value={gender}>
        <Text style={styles.radioLabel}>Gender</Text>
        <View style={styles.radioButtons}>
          <View style={styles.radioButton}>
            <RadioButton value="male" />
            <Text>Male</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton value="female" />
            <Text>Female</Text>
          </View>
        </View>
      </RadioButton.Group>

      <TextInput
        label="City"
        value={formData.city}
        onChangeText={(text) => setFormData({ ...formData, city: text })}
        style={styles.input}
      />
      <TextInput
        label="Street"
        value={formData.street}
        onChangeText={(text) => setFormData({ ...formData, street: text })}
        style={styles.input}
      />

      <RadioButton.Group onValueChange={setUserType} value={userType}>
        <Text style={styles.radioLabel}>User Type</Text>
        <View style={styles.radioButtons}>
          <View style={styles.radioButton}>
            <RadioButton value="User" />
            <Text>User</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton value="Lawyer" />
            <Text>Lawyer</Text>
          </View>
        </View>
      </RadioButton.Group>

      {userType === "Lawyer" && (
        <>
          <TextInput
            label="Description"
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            style={styles.input}
            multiline
          />
          <TextInput
            label="Years of Experience"
            value={formData.years_of_experience}
            onChangeText={(text) =>
              setFormData({ ...formData, years_of_experience: text })
            }
            style={styles.input}
            keyboardType="numeric"
          />
          <Button
            mode="contained"
            style={styles.fileInput}
            onPress={() => console.log("Upload CV")}
          >
            Upload CV
          </Button>
          <Button
            mode="contained"
            style={styles.fileInput}
            onPress={() => console.log("Upload Practicing Certificate")}
          >
            Upload Practicing Certificate
          </Button>
          <Menu
            visible={showMenu}
            onDismiss={() => setShowMenu(false)}
            anchor={
              <Button onPress={() => setShowMenu(true)}>Specialization</Button>
            }
          >
            {[
              "Corporate Law",
              "Criminal Law",
              "Family Law",
              "Intellectual Property Law",
              "Tax Law",
              "Environmental Law",
              "Immigration Law",
              "Real Estate Law",
              "Employment Law",
              "Personal Injury Law",
            ].map((item) => (
              <Menu.Item
                key={item}
                title={item}
                onPress={() => {
                  setSpecialization(item);
                  setShowMenu(false);
                }}
              />
            ))}
          </Menu>
          {specialization && (
            <Text>Selected Specialization: {specialization}</Text>
          )}
        </>
      )}

      <TextInput
        label="Password"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        label="Confirm Password"
        value={formData.passwordConfirm}
        onChangeText={(text) =>
          setFormData({ ...formData, passwordConfirm: text })
        }
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        Submit
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
  },
  radioLabel: {
    marginBottom: 8,
    fontSize: 16,
  },
  radioButtons: {
    flexDirection: "row",
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  fileInput: {
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default SignUp;
