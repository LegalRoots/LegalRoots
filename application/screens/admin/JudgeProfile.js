import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import { StatusBar } from "expo-status-bar";
import { AuthContext } from "../../src/shared/context/auth";

const JudgeProfile = () => {
  const [judge, setJudge] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, type } = useContext(AuthContext);

  console.log(process.env.API_URL);

  useEffect(() => {
    const fetchJudgeData = async () => {
      const url = `${process.env.API_URL}/admin/judges/${user.judge_id}`;

      try {
        const response = await axios.get(url);
        setJudge(response.data.data);
        setPhoto(response.data.judge_photo);
      } catch (error) {
        console.error("Error fetching judge data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJudgeData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!judge) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load judge data.</Text>
      </View>
    );
  }

  const {
    first_name,
    second_name,
    third_name,
    last_name,
    gender,
    birthdate,
    phone,
    email,
    address,
    court_name,
    experience,
    qualifications,
  } = judge;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: `data:image/png;base64,${photo}`,
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>
          {first_name} {second_name} {third_name} {last_name}
        </Text>
        <Text style={styles.job}>{court_name.name}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Gender:</Text>
        <Text style={styles.value}>{gender}</Text>

        <Text style={styles.label}>Birthdate:</Text>
        <Text style={styles.value}>{birthdate}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{phone}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{email}</Text>

        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>
          {address.city}, {address.street}
        </Text>

        <Text style={styles.label}>Court Name:</Text>
        <Text style={styles.value}>{court_name.name}</Text>

        <Text style={styles.label}>Experience:</Text>
        <Text style={styles.value}>{experience}</Text>
      </View>
      <StatusBar style="light" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#f9f9f9",
    flexGrow: 1,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    marginBottom: 0,
    backgroundColor: "#ffffff",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderColor: "gold",
    borderWidth: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
    textAlign: "center",
  },
  job: {
    fontSize: 18,
    color: "#7f8c8d",
    textAlign: "center",
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    flex: 2,
    marginTop: 0,
    backgroundColor: "#ffffff",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    paddingLeft: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#34495e",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#2c3e50",
    marginBottom: 15,
  },
});

export default JudgeProfile;
