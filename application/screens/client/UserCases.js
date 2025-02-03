import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  Avatar,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../../src/shared/context/auth";
import axios from "axios";
import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { API_URL } from "@env";
import { Divider } from "react-native-paper";

const CaseCard = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [plaintiffCases, setPlaintiffCases] = useState([]);
  const [defendantCases, setDefendantCases] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("plaintiff");

  useEffect(() => {
    const fetchPlaintiffCases = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/JusticeRoots/cases/user/plaintiff/${user.SSID}`
        );
        setPlaintiffCases(response.data);
      } catch (error) {
        console.error("Error fetching plaintiff cases:", error);
      }
    };

    const fetchDefendantCases = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/JusticeRoots/cases/user/defendant/${user.SSID}`
        );
        setDefendantCases(response.data);
      } catch (error) {
        console.error("Error fetching defendant cases:", error);
      }
    };

    fetchPlaintiffCases();
    fetchDefendantCases();
  }, [user.SSID]);

  const renderCaseCard = (caseData) => {
    const {
      Case: {
        caseType,
        judges,
        court_branch,
        data,
        description,
        init_date,
        isActive,
        isClosed,
      },
      lawyer,
    } = caseData;

    return (
      <View
        key={caseData._id}
        style={[
          styles.card,
          {
            borderColor: isClosed ? "red" : isActive ? "green" : "gray",
          },
        ]}
      >
        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Text style={styles.caseTitle}>{caseType?.name}</Text>
            <Text
              style={[
                styles.statusChip,
                {
                  backgroundColor: isClosed
                    ? "red"
                    : isActive
                    ? "green"
                    : "gray",
                },
              ]}
            >
              {isClosed ? "Closed" : isActive ? "Active" : "Inactive"}
            </Text>
          </View>

          <View style={styles.grid}>
            <View>
              <Text>{description}</Text>
              <Text style={styles.detailsText}>
                <Text style={styles.bold}>Court:</Text> {court_branch?.name} (
                {court_branch?.city})
              </Text>
              <Text style={styles.detailsText}>
                <Text style={styles.bold}>Filed On:</Text>{" "}
                {format(new Date(init_date), "dd MMM yyyy")}
              </Text>
              <View style={styles.divider}></View>
              <Text style={styles.detailsText}>
                <Text style={styles.bold}>Details:</Text>
              </Text>
              <View style={styles.dataStack}>
                {Object.entries(data).map(([key, value]) => (
                  <Text key={key}>
                    {key}: {value}
                  </Text>
                ))}
              </View>
            </View>

            <View>
              <Text style={styles.detailsText}>
                <Text style={styles.bold}>Judges:</Text>
              </Text>
              <View style={styles.avatarRow}>
                {judges.map((judge) => {
                  return (
                    <Text key={judge._id}>
                      {judge.first_name} {judge.last_name}
                    </Text>
                  );
                })}
              </View>
              <Text style={styles.detailsText}>
                <Text style={styles.bold}>Lawyers:</Text>
              </Text>
              <View style={styles.avatarRow}>
                {lawyer.map((lawyer) => {
                  return (
                    <Text key={lawyer._id}>
                      {lawyer.first_name} {lawyer.last_name}
                    </Text>
                  );
                })}
              </View>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.push("CasePage", { caseId: caseData._id })
              }
              style={styles.button}
            >
              <Text style={styles.buttonText}>Show More Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderCases = () => {
    const cases =
      selectedCategory === "plaintiff" ? plaintiffCases : defendantCases;

    if (cases.length === 0) {
      return <Text>No cases where you are a {selectedCategory}.</Text>;
    }

    return (
      <FlatList
        data={cases}
        renderItem={({ item }) => renderCaseCard(item)}
        keyExtractor={(item) => item._id}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectContainer}>
        <Text style={styles.label}>Case Category</Text>
        <View style={styles.select}>
          <Button
            title="Plaintiff Cases"
            onPress={() => setSelectedCategory("plaintiff")}
          />
          <Button
            title="Defendant Cases"
            onPress={() => setSelectedCategory("defendant")}
          />
        </View>
      </View>

      <View style={styles.caseListContainer}>
        <Text style={styles.title}>
          {selectedCategory === "plaintiff"
            ? "Plaintiff Cases"
            : "Defendant Cases"}
        </Text>
        {renderCases()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  selectContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  select: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  caseListContainer: {
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardContent: {},
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  caseTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    color: "white",
  },

  leftColumn: {
    flex: 3,
  },

  detailsText: {
    marginTop: 8,
  },
  bold: {
    fontWeight: "bold",
  },
  divider: {
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  dataStack: {
    marginTop: 8,
  },
  avatarRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#ffbf00",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});

export default CaseCard;
