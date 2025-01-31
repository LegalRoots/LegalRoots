import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import CourtDetails from "./components/CourtDetails";
import { AuthContext } from "../../src/shared/context/auth";

const Courts = () => {
  const { user, type } = useContext(AuthContext);
  let contextData = { type: type, userId: user.ssid };

  console.log(process.env.API_URL);

  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourtId, setSelectedCourtId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const { type, userId } = contextData;

    const endpoint =
      type === "Judge"
        ? `${process.env.API_URL}/admin/court/judgeId/${userId}`
        : `${process.env.API_URL}/admin/court/guestId/${userId}`;

    axios
      .get(endpoint)
      .then((response) => {
        setCourts(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courts:", error);
        setLoading(false);
      });
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderCourt = ({ item }) => {
    const date = formatDate(item.time);
    const time = formatTime(item.time);
    const fullName = `${item.initiator.first_name} ${item.initiator.second_name} ${item.initiator.third_name} ${item.initiator.last_name}`;

    return (
      <View style={styles.card}>
        <Text style={styles.title}>Case ID: {item.caseId}</Text>
        <Text style={styles.text}>Date: {date}</Text>
        <Text style={styles.text}>Time: {time}</Text>
        <Text style={styles.text}>Initiator: {fullName}</Text>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => {
            setSelectedCourtId(item._id);
            setModalVisible(true);
          }}
        >
          <Text style={styles.detailsButtonText}>Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : courts.length > 0 ? (
        <>
          <FlatList
            data={courts}
            renderItem={renderCourt}
            keyExtractor={(item) => item._id}
          />
          <Modal
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              {selectedCourtId && <CourtDetails courtId={selectedCourtId} />}
              <Button
                title="Close"
                onPress={() => setModalVisible(false)}
                color="#ffb200"
              />
            </View>
          </Modal>
        </>
      ) : (
        <Text style={styles.noDataText}>No courts found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  detailsButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ffb200",
    borderRadius: 5,
  },
  detailsButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  noDataText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});

export default Courts;
