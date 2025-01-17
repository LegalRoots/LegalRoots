import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  Linking,
  Alert,
  ScrollView,
} from "react-native";

import { Avatar, Chip } from "react-native-paper";
import axios from "axios";
import { AuthContext } from "../../src/shared/context/auth";
import Toast from "react-native-toast-message";
import { API_URL } from "@env";
import SpecializationList from "./SpecializationList";
import RecommendedLawyersSlider from "./RecommendedLawyersSlider";

const HireLawyer = () => {
  const { user } = useContext(AuthContext);

  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCases, setUserCases] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [recommendedLawyers, setRecommendedLawyers] = useState(null);
  const [lawyerDetails, setLawyerDetails] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/JusticeRoots/lawyers/specializations`
        );
        setSpecializations(response.data);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      }
    };
    fetchSpecializations();
  }, []);

  const handleSpecializationChange = async (specialization) => {
    setSelectedSpecialization(specialization);

    if (!specialization) return;

    setLoading(true);
    try {
      const lawyersResponse = await axios.get(
        `${API_URL}/JusticeRoots/lawyers?specialization=${specialization}`
      );
      setLawyers(lawyersResponse.data.data.lawyers);

      const recommendedResponse = await axios.get(
        `${API_URL}/JusticeRoots/lawyers/recommended?specialization=${specialization}`
      );
      setRecommendedLawyers(recommendedResponse.data);
    } catch (error) {
      console.error("Error fetching lawyers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHireLawyer = (lawyerId) => async () => {
    try {
      const response = await axios.get(
        `${API_URL}/JusticeRoots/cases/user/${user.SSID}`
      );
      setUserCases(response.data);
      setSelectedLawyer(lawyerId);
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching user cases:", error);
    }
  };

  const handleCaseSelection = async (caseId) => {
    try {
      await axios.post(`${API_URL}/JusticeRoots/cases/assignLawyer`, {
        lawyerId: selectedLawyer,
        caseId,
        user: user._id,
      });
      Toast.show({
        type: "success",
        text1: "Lawyer Assigned",
        text2: "A request was sent to the lawyer for this case",
      });
      setOpenModal(false);
    } catch (error) {
      setOpenModal(false);
      Toast.show({
        type: "error",
        text1: "Error Assigning Lawyer",
        text2: "You already have a pending request for this case",
      });
    }
  };
  const handleShowDetails = (lawyer) => () => {
    setLawyerDetails(lawyer);

    setOpenDetailsModal(true);
  };

  const renderLawyerItem = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: "#fff",
          padding: 15,
          marginBottom: 20,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#ddd",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Avatar.Image
            size={60}
            source={{ uri: `${API_URL}/uploads/images/${item.photo}` }}
            style={{ marginRight: 12 }}
          />
          <View>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
              {item.first_name} {item.last_name}
            </Text>
            <Text style={{ fontSize: 14, color: "#666" }}>
              Specialization: {item.specialization}
            </Text>
          </View>
        </View>

        <View
          style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}
        >
          <Chip
            style={{
              backgroundColor: item.isAvailable ? "#4caf50" : "#f44336",
              marginRight: 8,
              marginBottom: 8,
            }}
            textStyle={{ color: "#fff" }}
          >
            {item.isAvailable ? "Available" : "Unavailable"}
          </Chip>
          <Chip
            style={{
              backgroundColor: "#f1f1f1",
              marginRight: 8,
              marginBottom: 8,
            }}
            textStyle={{ color: "#333" }}
          >
            ${item.consultation_price}/hr
          </Chip>
        </View>

        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderWidth: 1,
            borderColor: "#ffbf00",
            borderRadius: 5,
            marginBottom: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={handleShowDetails(item)}
        >
          <Text style={styles.buttonText}>More Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleHireLawyer(item._id)}
          style={{
            backgroundColor: "#ffbf00",
            paddingVertical: 10,
            borderRadius: 6,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Hire Lawyer</Text>
        </TouchableOpacity>
      </View>
    );
  };
  function getRelativeTime(lastActive) {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);

    const seconds = Math.floor((now - lastActiveDate) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(days / 365);
    return `${years} years ago`;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search Lawyers"
        style={{
          marginBottom: 20,
          padding: 10,
          borderWidth: 1,
          borderRadius: 5,
        }}
      />

      <SpecializationList
        specializations={specializations}
        selectedSpecialization={selectedSpecialization}
        handleSpecializationChange={handleSpecializationChange}
      />

      <FlatList
        ListHeaderComponent={
          recommendedLawyers && (
            <RecommendedLawyersSlider
              recommendedLawyers={recommendedLawyers}
              handleHireLawyer={handleHireLawyer}
              handleShowDetails={handleShowDetails}
            />
          )
        }
        data={lawyers}
        renderItem={renderLawyerItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          loading ? (
            <Text>Select Specialization</Text>
          ) : (
            <Text>No lawyers available</Text>
          )
        }
      />
      <Toast />

      {lawyerDetails && (
        <Modal
          visible={openDetailsModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setOpenDetailsModal(false)}
        >
          <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.content}>
              <Text style={styles.title}>
                {`${lawyerDetails.first_name} ${lawyerDetails.last_name}`}
              </Text>
              <TouchableOpacity
                onPress={() => setOpenDetailsModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>

            {/* Lawyer's Photo and Basic Info */}
            <View style={styles.profileSection}>
              <Image
                source={{
                  uri: `http://localhost:5000/images/${lawyerDetails.photo}`,
                }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.name}>
                  {`${lawyerDetails.first_name} ${lawyerDetails.last_name}`}
                </Text>
                <Text style={styles.infoText}>
                  Specialization: {lawyerDetails.specialization}
                </Text>
                <Text style={styles.infoText}>
                  Years of Experience: {lawyerDetails.yearsOfExperience}
                </Text>
                <Text style={styles.infoText}>
                  Consultation Price: ${lawyerDetails.consultation_price}
                </Text>
                <Text style={styles.infoText}>
                  Rating (out of 5): {lawyerDetails.assessment}
                </Text>
                <Text style={styles.infoText}>
                  Last Active: {getRelativeTime(lawyerDetails.lastActive)}
                </Text>
                <Button
                  title="Download CV"
                  mode="contained"
                  onPress={() =>
                    Linking.openURL(`${API_URL}/uploads/${lawyerDetails.cv}`)
                  }
                  style={styles.downloadButton}
                />
              </View>
            </View>

            {/* Contact Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Details</Text>
              <Text style={styles.infoText}>Email: {lawyerDetails.email}</Text>
              <Text style={styles.infoText}>Phone: {lawyerDetails.phone}</Text>
              <Text style={styles.infoText}>City: {lawyerDetails.city}</Text>
              <Text style={styles.infoText}>
                Street: {lawyerDetails.street}
              </Text>
            </View>

            {/* Performance Metrics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance Metrics</Text>
              <Text style={styles.infoText}>
                Total Cases: {lawyerDetails.totalCases}
              </Text>
              <Text style={styles.infoText}>
                Won Cases: {lawyerDetails.wonCases}
              </Text>
              <Text style={styles.infoText}>
                Lost Cases: {lawyerDetails.lostCases}
              </Text>
              <Text style={styles.infoText}>
                Ongoing Cases: {lawyerDetails.ongoingCases}
              </Text>
            </View>

            {/* Client Reviews */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Client Reviews</Text>
              {lawyerDetails.clientReviews.length > 0 ? (
                lawyerDetails.clientReviews.map((review, index) => (
                  <View key={index} style={styles.reviewCard}>
                    <Text style={styles.reviewText}>
                      Client:{" "}
                      {review.clientId.first_name +
                        " " +
                        review.clientId.last_name}
                    </Text>
                    <Text style={styles.infoText}>
                      Rating: {review.rating}/5
                    </Text>
                    <Text style={styles.reviewFeedback}>{review.feedback}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.infoText}>No reviews yet.</Text>
              )}
            </View>
          </ScrollView>
        </Modal>
      )}

      <Modal visible={openModal} onRequestClose={() => setOpenModal(false)}>
        <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
          <Text>Select a Case</Text>
          {userCases.length === 0 ? (
            <Text>No cases without a lawyer found.</Text>
          ) : (
            userCases.map((userCase) => (
              <TouchableOpacity
                key={userCase._id}
                onPress={() => handleCaseSelection(userCase._id)}
                style={{
                  padding: 10,
                  borderWidth: 1,
                  marginVertical: 10,
                  borderRadius: 5,
                }}
              >
                <Text>{`Case ID: ${userCase._id}`}</Text>
                <Text>{`Case Type: ${
                  userCase.Case?.caseType?.name || "N/A"
                }`}</Text>
                <Text>{`Case Description: ${
                  userCase.Case?.description || "No description"
                }`}</Text>
              </TouchableOpacity>
            ))
          )}
          <Button title="Close" onPress={() => setOpenModal(false)} />
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalContent: {
    backgroundColor: "#fff", // Dialog background color
    width: "90%", // Width of the modal (adjust as needed)
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%", // Limit the modal's height to prevent overflow
    elevation: 5, // Adds a shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4, // Shadow for iOS
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 50,
    marginTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#333",
    fontSize: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  downloadButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reviewCard: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  reviewFeedback: {
    fontSize: 14,
    color: "#555",
  },
});
export default HireLawyer;
