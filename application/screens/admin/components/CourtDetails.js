import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";

const CourtDetails = ({ courtId }) => {
  const [court, setCourt] = useState(null);
  const [defTeam, setDefTeam] = useState([]);
  const [plTeam, setPlTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(process.env.API_URL);

  useEffect(() => {
    const fetchCourtDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.API_URL}/admin/court/details/${courtId}`
        );
        const courtData = response.data.court;

        setCourt(courtData);
        setDefTeam([]);
        setPlTeam([]);

        courtData.users.forEach((user) => {
          if (courtData.defense_team.includes(user.ssid)) {
            setDefTeam((prev) => [...prev, user]);
          } else if (courtData.plaintiff_team.includes(user.ssid)) {
            setPlTeam((prev) => [...prev, user]);
          }
        });

        courtData.lawyers.forEach((lawyer) => {
          if (courtData.defense_team.includes(lawyer.ssid)) {
            setDefTeam((prev) => [...prev, lawyer]);
          } else if (courtData.plaintiff_team.includes(lawyer.ssid)) {
            setPlTeam((prev) => [...prev, lawyer]);
          }
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching court details:", error);
        setLoading(false);
      }
    };

    fetchCourtDetails();
  }, [courtId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!court) {
    return <Text style={styles.errorText}>Failed to load court details.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.mainSection}>
        <Text style={styles.title}>{court.caseId}</Text>
        <Text style={styles.text}>Case Type: {court.caseType}</Text>
        <Text style={styles.text}>Court Branch: {court.court_branch}</Text>
        <Text style={styles.text}>
          Date: {new Date(court.time).toLocaleDateString()}
        </Text>
        <Text style={styles.text}>
          Time: {new Date(court.time).toLocaleTimeString()}
        </Text>
        <Text style={styles.text}>
          Status:{" "}
          {court.hasStarted && court.hasFinished
            ? "Finished"
            : court.hasStarted && !court.hasFinished
            ? "Ongoing"
            : "Not Started"}
        </Text>
        <Text style={styles.text}>
          Meeting ID:{" "}
          {court.hasStarted
            ? court.meeting_id
            : "Meeting ID will be available when the court starts"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>Plaintiff Team</Text>
        {plTeam.map((user, index) => (
          <Text key={index} style={styles.text}>
            {user.name} (SSID: {user.ssid})
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>Defense Team</Text>
        {defTeam.map((lawyer, index) => (
          <Text key={index} style={styles.text}>
            {lawyer.name} (SSID: {lawyer.ssid})
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>Employees</Text>
        {court.employees.map((employee, index) => (
          <Text key={index} style={styles.text}>
            {employee.name} (SSID: {employee.ssid})
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>Judges</Text>
        {court.judges.map((judge, index) => (
          <Text key={index} style={styles.text}>
            {judge.name} (SSID: {judge.ssid})
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    borderColor: "black",
    marginBottom: 50,
    height: "97%",
  },
  mainSection: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default CourtDetails;
