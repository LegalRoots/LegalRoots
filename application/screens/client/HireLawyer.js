import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Modal,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";

import { Avatar, Chip } from "react-native-paper";
import axios from "axios";
import { AuthContext } from "../../src/shared/context/auth";
import { useToast } from "react-native-toast-notifications";
import { API_URL } from "@env";
import SpecializationList from "./SpecializationList";
import RecommendedLawyersSlider from "./RecommendedLawyersSlider";

const HireLawyer = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCases, setUserCases] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [recommendedLawyers, setRecommendedLawyers] = useState(null);

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
      await axios.post("${API_URL}/JusticeRoots/cases/assignLawyer", {
        lawyerId: selectedLawyer,
        caseId,
        user: user._id,
      });
      toast.show("Lawyer Assigned Successfully", { type: "success" });
      setOpenModal(false);
    } catch (error) {
      toast.show("Failed to assign lawyer to the case", { type: "danger" });
    }
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

export default HireLawyer;
