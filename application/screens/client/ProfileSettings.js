import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../src/shared/context/auth";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { API_URL } from "@env";

const ProfileSettings = () => {
  const { updateUserContext } = useContext(AuthContext);

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    SSID: user.SSID,
    birthday: user.birthday,
    city: user.city,
    street: user.street,
    photo: user.photo,
  });

  const handleInputChange = (name, value) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfile((prev) => ({ ...prev, photo: result.uri }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/JusticeRoots/users/updateProfile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        }
      );
      const data = await response.json();

      toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: data.message,
      });
      updateUserContext(data.user);
    } catch (error) {
      console.error("Error updating profile", error);
      toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile Settings</Text>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: profile.photo
                ? `${API_URL}/uploads/images/${profile.photo}`
                : `${API_URL}/uploads/images/default.png`,
            }}
            style={styles.avatar}
          />
          <Button title="Change Photo" onPress={handleImageUpload} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={profile.first_name}
            onChangeText={(text) => handleInputChange("first_name", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={profile.last_name}
            onChangeText={(text) => handleInputChange("last_name", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={profile.email}
            onChangeText={(text) => handleInputChange("email", text)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={profile.phone}
            onChangeText={(text) => handleInputChange("phone", text)}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="SSID"
            value={profile.SSID}
            onChangeText={(text) => handleInputChange("SSID", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Birthday"
            value={profile.birthday.split("T")[0]}
            onChangeText={(text) => handleInputChange("birthday", text)}
            keyboardType="default"
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={profile.city}
            onChangeText={(text) => handleInputChange("city", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Street"
            value={profile.street}
            onChangeText={(text) => handleInputChange("street", text)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={loading ? "Saving..." : "Save Changes"}
            onPress={handleSave}
            disabled={loading}
          />
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
      </View>
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    maxWidth: 800,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
});

export default ProfileSettings;
