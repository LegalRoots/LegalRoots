import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card, Button, Menu, Provider } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import { AuthContext } from "../../src/shared/context/auth";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
const primaryColor = "#ffbf00";

const LawyerCases = () => {
  const navigation = useNavigation();
  const [plaintiffCases, setPlaintiffCases] = useState([]);
  const [defendantCases, setDefendantCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("plaintiff");
  const [users, setUsers] = useState({});
  const { user } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("plaintiff");
  const [items, setItems] = useState([
    { label: "Plaintiff Cases", value: "plaintiff" },
    { label: "Defendant Cases", value: "defendant" },
  ]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const [plaintiffRes, defendantRes] = await Promise.all([
          axios.get(
            `${API_URL}/JusticeRoots/cases/lawyerPlaintiff/${user._id}`
          ),
          axios.get(
            `${API_URL}/JusticeRoots/cases/lawyerDefendant/${user._id}`
          ),
        ]);
        const allCases = [...plaintiffRes.data, ...defendantRes.data];

        const uniqueSSIDs = [
          ...new Set(allCases.map((caseItem) => caseItem.user)),
        ];

        const userResponses = await Promise.all(
          uniqueSSIDs.map((ssid) =>
            axios.get(`${API_URL}/JusticeRoots/users/${ssid}`)
          )
        );

        const usersMap = userResponses.reduce((acc, res, index) => {
          acc[uniqueSSIDs[index]] = res.data;
          return acc;
        }, {});

        setPlaintiffCases(plaintiffRes.data);
        setDefendantCases(defendantRes.data);
        setUsers(usersMap);
      } catch (err) {
        console.error("Error fetching cases or users:", err);
        setError("Failed to load cases or user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [user._id]);

  const casesToShow =
    selectedType === "plaintiff" ? plaintiffCases : defendantCases;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Lawyer Cases</Text>
      <Menu
        visible={open}
        onDismiss={() => setOpen(false)}
        anchor={
          <Button
            onPress={() => setOpen(true)}
            mode="contained"
            style={{ backgroundColor: primaryColor }}
          >
            {selectedType === "plaintiff"
              ? "Plaintiff Cases"
              : "Defendant Cases"}
          </Button>
        }
      >
        <Menu.Item
          onPress={() => {
            setSelectedType("plaintiff");
            setOpen(false);
          }}
          title="Plaintiff Cases"
        />
        <Menu.Item
          onPress={() => {
            setSelectedType("defendant");
            setOpen(false);
          }}
          title="Defendant Cases"
        />
      </Menu>

      {casesToShow.length === 0 ? (
        <Text style={styles.noCasesText}>
          No cases available for the selected type.
        </Text>
      ) : (
        casesToShow.map((caseItem) => (
          <Card key={caseItem._id} style={styles.card}>
            <Card.Content>
              <Text style={styles.caseType}>{caseItem.Case.caseType.name}</Text>
              <Text style={styles.description}>
                {caseItem.Case.description}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.label}>Court:</Text>{" "}
                {caseItem.Case.court_branch.name}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.label}>Judge:</Text>{" "}
                {caseItem.Case.judges[0]?.first_name}{" "}
                {caseItem.Case.judges[0]?.last_name}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.label}>Client:</Text>{" "}
                {users[caseItem.user]?.user.first_name}{" "}
                {users[caseItem.user]?.user.last_name}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.label}>Case Status:</Text>{" "}
                {caseItem.status || "Pending"}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={() =>
                  navigation.navigate("CasePage", { caseId: caseItem._id })
                }
                style={styles.button}
              >
                View Details
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
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: primaryColor,
    textAlign: "center",
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  caseType: {
    fontSize: 18,
    fontWeight: "bold",
    color: primaryColor,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
  },
  button: {
    marginTop: 8,
    borderColor: primaryColor,
  },
  noCasesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginVertical: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});

export default LawyerCases;
