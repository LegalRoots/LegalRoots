import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";

const Judges = () => {
  const [judges, setJudges] = useState([]);
  const [filteredJudges, setFilteredJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  console.log(process.env.API_URL);

  useEffect(() => {
    // Fetch the data
    axios
      .get(`${process.env.API_URL}/admin/judges`)
      .then((response) => {
        setJudges(response.data);
        setFilteredJudges(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching judges:", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = judges.filter((judge) => {
      const fullName =
        `${judge.first_name} ${judge.second_name} ${judge.third_name} ${judge.last_name}`.toLowerCase();
      return fullName.includes(text.toLowerCase());
    });
    setFilteredJudges(filtered);
  };

  const renderJudge = ({ item }) => {
    const fullName = `${item.first_name} ${item.second_name} ${item.third_name} ${item.last_name}`;
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{fullName}</Text>
        <Text style={styles.text}>Judge ID: {item.judge_id}</Text>
        <Text style={styles.text}>SSID: {item.ssid}</Text>
        <Text style={styles.text}>Court Name: {item.court_name.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search judges by name..."
        value={searchText}
        onChangeText={handleSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredJudges}
          renderItem={renderJudge}
          keyExtractor={(item) => item._id}
        />
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
  searchInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
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
    borderLeftWidth: 10,
  },
  title: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    marginBottom: 3,
  },
});

export default Judges;
