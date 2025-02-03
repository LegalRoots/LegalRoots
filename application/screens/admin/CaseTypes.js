import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import axios from "axios";

const CaseTypes = () => {
  const [caseTypes, setCaseTypes] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [searchText, setSearchText] = useState("");
  console.log(process.env.API_URL);

  useEffect(() => {
    const fetchCaseTypes = async () => {
      try {
        const response = await axios.get(
          `${process.env.API_URL}/admin/caseType`
        );
        setCaseTypes(response.data.caseTypes);
      } catch (error) {
        console.error("Error fetching case types:", error);
      }
    };

    fetchCaseTypes();
  }, []);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const filteredCaseTypes = caseTypes.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item._id.includes(searchText)
  );

  const renderItem = ({ item }) => {
    const isExpanded = expandedIds.includes(item._id);
    const fieldsToShow = isExpanded ? item.fields : item.fields.slice(0, 2);

    return (
      <View style={styles.card}>
        <Text style={styles.id}># {item._id}</Text>
        <Text style={styles.name}>{item.name}</Text>
        {fieldsToShow.map((field) => (
          <View key={field._id} style={styles.field}>
            <Text style={styles.fieldName}>{field.name}</Text>
            <Text style={styles.fieldType}>
              {field.type} {field.required ? "(Required)" : "(Optional)"}
            </Text>
          </View>
        ))}
        {item.fields.length > 2 && (
          <TouchableOpacity onPress={() => toggleExpand(item._id)}>
            <Text style={styles.moreButton}>
              {isExpanded ? "Show Less" : "Show More"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or ID"
        value={searchText}
        onChangeText={handleSearch}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <FlatList
          data={filteredCaseTypes}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  searchInput: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  list: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  id: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  field: {
    marginTop: 8,
  },
  fieldName: {
    fontSize: 16,
    color: "#555",
  },
  fieldType: {
    fontSize: 14,
    color: "#777",
  },
  moreButton: {
    marginTop: 12,
    fontSize: 14,
    color: "#ffb200",
    fontWeight: "bold",
  },
});

export default CaseTypes;
