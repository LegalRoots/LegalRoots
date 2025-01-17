import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Card, Button, Divider, IconButton, List } from "react-native-paper";
import axios from "axios";
import { AuthContext } from "../../src/shared/context/auth";
import { API_URL } from "@env";

const PendingCases = () => {
  const [pendingCases, setPendingCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPendingCases = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/JusticeRoots/cases/assignments/pending/${user._id}`
        );
        setPendingCases(response.data);
      } catch (error) {
        console.error("Error fetching pending cases:", error);
        Alert.alert("Error", "Failed to load pending cases.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCases();
  }, []);

  const handleStatusUpdate = async (caseId, status) => {
    setUpdating(caseId);
    try {
      await axios.put(`${API_URL}/JusticeRoots/cases/assignments/${caseId}`, {
        status,
      });
      setPendingCases((prev) =>
        prev.filter((assignment) => assignment._id !== caseId)
      );
      Alert.alert("Success", `Case ${status.toLowerCase()} successfully!`);
    } catch (error) {
      console.error(`Error updating case status to ${status}:`, error);
      Alert.alert("Error", `Failed to update the case to ${status}.`);
    } finally {
      setUpdating(null);
    }
  };

  const toggleExpand = (cardId) => {
    setExpandedCard((prev) => (prev === cardId ? null : cardId));
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pending Case Assignments</Text>
      {pendingCases.length === 0 ? (
        <Text style={styles.noCasesText}>No pending cases at the moment.</Text>
      ) : (
        pendingCases.map((assignment) => (
          <Card key={assignment._id} style={styles.card}>
            <Card.Content>
              <Text style={styles.caseTitle}>
                Case Title: {assignment.caseId.Case.caseType.name}
              </Text>
              <Text style={styles.details}>
                <Text style={styles.label}>Client:</Text>{" "}
                {assignment.clientId.first_name} {assignment.clientId.last_name}{" "}
                ({assignment.clientId.email})
              </Text>
              <Text style={styles.details}>
                <Text style={styles.label}>Status:</Text> {assignment.status}
              </Text>
              <Text style={styles.details}>
                <Text style={styles.label}>Requested At:</Text>{" "}
                {new Date(assignment.requestedAt).toLocaleString()}
              </Text>
              <Text style={styles.details}>
                <Text style={styles.label}>Case Description:</Text>{" "}
                {assignment.caseId.Case.description}
              </Text>
              <Text style={styles.details}>
                <Text style={styles.label}>Judges:</Text>{" "}
                {assignment.caseId.Case.judges
                  .map((judge) => judge.first_name + " " + judge.last_name)
                  .join(", ")}
              </Text>
              <Button
                mode="text"
                onPress={() => toggleExpand(assignment._id)}
                icon={
                  expandedCard === assignment._id
                    ? "chevron-up"
                    : "chevron-down"
                }
              >
                More Details
              </Button>
              {expandedCard === assignment._id && (
                <List.Section>
                  <List.Item
                    title="Case Type"
                    description={assignment.caseId.Case.caseType.name}
                  />
                  <List.Item
                    title="Court Details"
                    description={`${assignment.caseId.Case.court_branch.name}, ${assignment.caseId.Case.court_branch.city}`}
                  />
                  <List.Item
                    title="Case Documents"
                    description={() =>
                      assignment.caseId.case_documents.map((doc) => (
                        <TouchableOpacity
                          key={doc._id}
                          onPress={() =>
                            Linking.openURL(`${API_URL}/${doc.path}`)
                          }
                        >
                          <Text style={styles.link}>
                            {doc.path.split("\\").pop()}
                          </Text>
                        </TouchableOpacity>
                      ))
                    }
                  />
                  <Divider />
                </List.Section>
              )}
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => handleStatusUpdate(assignment._id, "Accepted")}
                loading={updating === assignment._id}
                style={styles.acceptButton}
              >
                Accept
              </Button>
              <Button
                mode="contained"
                onPress={() => handleStatusUpdate(assignment._id, "Denied")}
                loading={updating === assignment._id}
                style={styles.denyButton}
              >
                Deny
              </Button>
            </Card.Actions>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
  },
  caseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  details: {
    fontSize: 14,
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
  },
  noCasesText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
  acceptButton: {
    marginRight: 8,
    backgroundColor: "green",
  },
  denyButton: {
    backgroundColor: "red",
  },
});

export default PendingCases;
