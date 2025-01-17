import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../../src/shared/context/auth";
import { API_URL } from "@env";

const PayLawyer = () => {
  const { user } = useContext(AuthContext);
  const [lawyers, setLawyers] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/JusticeRoots/cases/my-lawyers/${user.SSID}`)
      .then((response) => response.json())
      .then((data) => {
        setLawyers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching lawyers:", error);
        setLoading(false);
      });
  }, []);

  const handleLawyerSelect = (lawyer) => {
    setSelectedLawyer(lawyer);
    setModalVisible(false);
  };

  const handlePayment = () => {
    alert(`Payment initiated for lawyer ID: ${selectedLawyer._id}`);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pay Lawyer</Text>

      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectButtonText}>
          {selectedLawyer
            ? `${selectedLawyer.first_name} ${selectedLawyer.last_name}`
            : "Select a Lawyer"}
        </Text>
      </TouchableOpacity>

      {selectedLawyer && (
        <View style={styles.card}>
          <Image
            style={styles.image}
            source={{
              uri: `${API_URL}/uploads/images/${selectedLawyer.photo}`,
            }}
          />
          <Text style={styles.cardText}>
            {selectedLawyer.first_name} {selectedLawyer.last_name}
          </Text>
          <Text style={styles.cardText}>{selectedLawyer.email}</Text>
          <Text style={styles.cardText}>
            Consultation Price: {selectedLawyer.consultation_price}$
          </Text>
        </View>
      )}

      <Text style={styles.subtitle}>Payment Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Card Number"
        keyboardType="numeric"
      />
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Expiry Date"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="CVV"
          keyboardType="numeric"
        />
      </View>

      <Button
        title="Pay Now"
        onPress={handlePayment}
        disabled={!selectedLawyer}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              width: "85%",
              maxHeight: "80%",
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 5,
            }}
          >
            <FlatList
              data={lawyers}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f1f1f1",
                    alignItems: "center",
                  }}
                  onPress={() => handleLawyerSelect(item)}
                >
                  <Image
                    source={{
                      uri: `http://localhost:5000/uploads/images/${item.photo}`,
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      marginRight: 15,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
                      {item.first_name} {item.last_name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#777",
                        marginTop: 5,
                      }}
                    >
                      Consultation Price: {item.consultation_price}$
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={{
                backgroundColor: "#ff4c4c",
                paddingVertical: 12,
                borderRadius: 5,
                alignItems: "center",
                marginTop: 20,
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  selectButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  selectButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  card: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  cardText: {
    fontSize: 16,
    marginTop: 5,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 32,
  },
  modalItem: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
    height: "100%",
  },
  modalItemText: {
    fontSize: 18,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PayLawyer;
