import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.5:5000/admin/employees"
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderEmployee = ({ item }) => {
    const { full_name, email, ssid, employee_id } = item.data;
    const photo = item.image;

    return (
      <View style={styles.employeeCard}>
        <Image
          source={{ uri: `data:image/png;base64,${photo}` }}
          style={styles.employeeImage}
        />
        <View style={styles.employeeDetails}>
          <Text style={styles.employeeName}>{full_name}</Text>
          <Text style={styles.employeeEmail}>{email}</Text>
          <Text style={styles.employeeMeta}>ID: {employee_id}</Text>
          <Text style={styles.employeeMeta}>SSID: {ssid}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FlatList
        data={employees}
        keyExtractor={(item) => item.data._id}
        renderItem={renderEmployee}
        showsVerticalScrollIndicator={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  employeeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  employeeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  employeeDetails: {
    flex: 1,
    justifyContent: "center",
  },
  employeeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  employeeEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  employeeMeta: {
    fontSize: 14,
    color: "#999",
  },
});

export default Employees;
