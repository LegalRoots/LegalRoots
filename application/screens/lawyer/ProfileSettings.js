import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../src/shared/context/auth";

const ProfilePage = () => {
  const { user, logout } = React.useContext(AuthContext);
  const [isAssignmentsVisible, setAssignmentsVisible] = useState(false);

  const {
    first_name,
    last_name,
    photo,
    specialization,
    city,
    yearsOfExperience,
    consultation_price,
    email,
    phone,
    isVerified,
    description,
    ongoingCases,
    assignments,
    clientReviews,
    cv,
    practicing_certificate,
  } = user;

  const handleViewDocument = (type) => {
    Alert.alert(`View ${type}`, `Opening ${type}...`, [{ text: "OK" }], {
      cancelable: true,
    });
    // Navigate to the document view or use a document viewer library
  };

  const handleLogout = () => {
    logout(); // Ensure `logout` function is defined in the context
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={{
            uri:
              photo === `default.png`
                ? "https://via.placeholder.com/150"
                : `${API_URL}/uploads/images/${photo}`,
          }}
          style={styles.profileImage}
        />
        <View style={styles.headerDetails}>
          <Text style={styles.name}>{`${first_name} ${last_name}`}</Text>
          <Text style={styles.specialization}>{specialization}</Text>
          <View style={styles.location}>
            <Ionicons name="location-outline" size={16} color="#555" />
            <Text style={styles.locationText}>{city}</Text>
          </View>
          {isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="white" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
      </View>

      {/* Overview Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Years of Experience: </Text>
          {yearsOfExperience}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Consultation Price: </Text>$
          {consultation_price}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Email: </Text>
          {email}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Phone: </Text>
          {phone}
        </Text>
      </View>

      {/* Assignments Section */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.expandableHeader}
          onPress={() => setAssignmentsVisible(!isAssignmentsVisible)}
        >
          <Text style={styles.sectionTitle}>Assignments</Text>
          <Ionicons
            name={isAssignmentsVisible ? "chevron-up" : "chevron-down"}
            size={20}
            color="#333"
          />
        </TouchableOpacity>
        {isAssignmentsVisible &&
          assignments.map((assignment, index) => (
            <View key={index} style={styles.assignmentCard}>
              <Text style={styles.assignmentText}>
                Case ID: {assignment.caseId}
              </Text>
              <Text>Status: {assignment.status}</Text>
              <Text>
                Requested At:{" "}
                {new Date(assignment.requestedAt).toLocaleDateString()}
              </Text>
            </View>
          ))}
      </View>

      {/* Reviews Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client Reviews</Text>
        {clientReviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <Text style={styles.reviewText}>
              {review.feedback} -{" "}
              <Text style={styles.rating}>{review.rating}★</Text>
            </Text>
            <Text style={styles.reviewDate}>
              {new Date(review.reviewedAt).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>

      {/* Documents Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Documents</Text>
        <TouchableOpacity onPress={() => handleViewDocument("CV")}>
          <Text style={styles.link}>View CV</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleViewDocument("Practicing Certificate")}
        >
          <Text style={styles.link}>View Practicing Certificate</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  headerDetails: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  specialization: {
    fontSize: 16,
    color: "#555",
    marginVertical: 5,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  locationText: {
    fontSize: 14,
    color: "#555",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  verifiedText: {
    color: "white",
    fontSize: 12,
    marginLeft: 5,
  },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  detail: {
    fontSize: 14,
    color: "#333",
    marginVertical: 5,
  },
  label: {
    fontWeight: "bold",
  },
  assignmentCard: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  assignmentText: {
    fontWeight: "bold",
    color: "#333",
  },
  reviewCard: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
  },
  rating: {
    color: "#FFD700",
    fontWeight: "bold",
  },
  reviewDate: {
    fontSize: 12,
    color: "#555",
  },
  link: {
    color: "#007BFF",
    textDecorationLine: "underline",
    marginVertical: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  button: {
    flex: 1,
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#ddd",
  },
  secondaryButtonText: {
    color: "#333",
  },
  expandableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ProfilePage;
