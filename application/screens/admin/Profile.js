import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";

const Profile = () => {
  const [employee, setEmployee] = useState(null);
  const [photo, setPhoto] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const type = "Admin";
      let url;
      if (type === "Admin") {
        //if has court defined if not just fetch all
        url = "http://192.168.1.5:5000/admin/employees/ssid/123456789";
      } else {
        url = "http://192.168.1.5:5000/admin/employees";
      }

      try {
        const response = await axios.get(url);
        setEmployee(response.data.employee.data);
        setPhoto(response.data.employee.employee_photo);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!employee) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load employee data.</Text>
      </View>
    );
  }

  const {
    full_name,
    job,
    gender,
    birthdate,
    phone,
    email,
    employee_photo,
    court_branch,
  } = employee;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: `data:image/png;base64,${photo}`,
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{full_name}</Text>
        <Text style={styles.job}>{job.title}</Text>
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

        {court_branch && (
          <>
            <Text style={styles.label}>Court Branch:</Text>
            <Text style={styles.value}>{court_branch?.name}</Text>
          </>
        )}
      </View>
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
  },
  job: {
    fontSize: 18,
    color: "#7f8c8d",
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
export default Profile;
