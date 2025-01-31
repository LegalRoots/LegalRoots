import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { AuthContext } from "../../src/shared/context/auth";

const Cases = () => {
  const { user, type } = useContext(AuthContext);
  console.log(type);
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  console.log(process.env.API_URL);

  useEffect(() => {
    const fetchCases = async () => {
      let url;
      if (type === "Admin") {
        url = `${process.env.API_URL}/admin/case/assigned/employeeId/${user._id}`;
      } else {
        url = `${process.env.API_URL}/admin/case/judge/6734787624cd473b4d702a43`;
      }
      console.log(url);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (type === "Admin") {
          setCases(data.assignedCases);
          setFilteredCases(data.assignedCases);
        } else {
          setCases(data.cases);
          setFilteredCases(data.cases);
        }
        // Initialize filtered cases
      } catch (err) {
        console.error(err);
        setError("Failed to load cases. Please try again.");
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredCases(cases); // Reset to all cases when search query is empty
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = cases.filter(
      (item) =>
        item.caseId._id.toLowerCase().includes(lowerQuery) ||
        item.caseId.defendant.toLowerCase().includes(lowerQuery) ||
        item.caseId.plaintiff.toLowerCase().includes(lowerQuery)
    );

    setFilteredCases(filtered);
  };

  const renderCase = ({ item }) => (
    <View style={styles.caseCard}>
      <Text style={styles.caseTitle}># {item.caseId._id}</Text>
      <Text style={styles.textStyle}>
        Description: {item.caseId.description}
      </Text>
      <Text style={styles.textStyle}>Plaintiff: {item.caseId.plaintiff}</Text>
      <Text style={styles.textStyle}>Defendant: {item.caseId.defendant}</Text>
      <Text style={styles.textStyle}>
        Added on: {new Date(item.add_date).toLocaleDateString()}
      </Text>
      {Object.entries(item.caseId.data).map((i) => (
        <Text style={styles.textStyle} key={i[0]}>
          {i[0] + ": " + i[1]}
        </Text>
      ))}
    </View>
  );
  const renderCase2 = ({ item }) => (
    <View style={styles.caseCard}>
      <Text style={styles.caseTitle}># {item._id}</Text>
      <Text style={styles.textStyle}>Description: {item.description}</Text>
      <Text style={styles.textStyle}>Plaintiff: {item.plaintiff}</Text>
      <Text style={styles.textStyle}>Defendant: {item.defendant}</Text>
      <Text style={styles.textStyle}>
        Added on: {new Date(item.init_date).toLocaleDateString()}
      </Text>
      {Object.entries(item.data).map((i) => (
        <Text style={styles.textStyle} key={i[0]}>
          {i[0] + ": " + i[1]}
        </Text>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
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
    <View style={styles.container}>
      {filteredCases?.length > 0 && (
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Case ID, Plaintiff, or Defendant"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      )}
      {filteredCases?.length > 0 && type === "Admin" ? (
        <FlatList
          data={filteredCases}
          renderItem={renderCase}
          keyExtractor={(item) => item._id}
        />
      ) : filteredCases?.length > 0 && type !== "Admin" ? (
        <FlatList
          data={filteredCases}
          renderItem={renderCase2}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <Text style={styles.noCasesText}>No cases found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  caseCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textStyle: {
    marginBottom: 8,
  },
  caseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#ffb200",
  },
  searchInput: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  noCasesText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default Cases;
