import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Button, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { AuthContext } from "../../src/shared/context/auth";
import { API_URL } from "@env";

const ChatsPage = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [lawyers, setLawyers] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [viewMode, setViewMode] = useState("lawyers"); // 'lawyers' or 'users'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lawyersResponse, usersResponse] = await Promise.all([
          fetch(`${API_URL}/JusticeRoots/lawyers`).then((res) => res.json()),
          fetch(`${API_URL}/JusticeRoots/users`).then((res) => res.json()),
        ]);

        setLawyers(lawyersResponse.data.lawyers);
        setUsers(usersResponse.data.users);
        setFilteredLawyers(lawyersResponse.data.lawyers);
        setFilteredUsers(usersResponse.data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    setFilteredLawyers(
      lawyers.filter(
        (lawyer) =>
          `${lawyer.first_name} ${lawyer.last_name}`
            .toLowerCase()
            .includes(lowerCaseQuery) &&
          (specializationFilter
            ? lawyer.specialization === specializationFilter
            : true)
      )
    );
    setFilteredUsers(
      users.filter((user) =>
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(lowerCaseQuery)
      )
    );
  }, [searchQuery, specializationFilter, lawyers, users]);

  const handleOpenChat = (id, type) => {
    axios
      .post(`${API_URL}/JusticeRoots/conversations`, {
        participants: [user._id, id],
        type,
      })
      .then((response) => {
        navigation.navigate("ChatScreen", {
          convId: response.data._id,
        });
      })
      .catch((error) => {
        console.error("Error creating conversation:", error);
      });
  };

  const renderItem = ({ item, type }) => (
    <View style={styles.listItem}>
      <Image
        source={{ uri: `${API_URL}/uploads/images/${item.photo}` }}
        style={styles.avatar}
      />
      <View style={styles.itemDetails}>
        <Text
          style={styles.itemName}
        >{`${item.first_name} ${item.last_name}`}</Text>
        <Text style={styles.itemSecondary}>
          {type === "lawyer"
            ? `${item.specialization} - ${item.city}`
            : item.email}
        </Text>
      </View>
      <Button
        mode="contained"
        onPress={() => handleOpenChat(item._id, type)}
        icon="chat"
        style={styles.chatButton}
      >
        Chat
      </Button>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          mode={viewMode === "lawyers" ? "contained" : "outlined"}
          onPress={() => setViewMode("lawyers")}
        >
          Lawyers
        </Button>
        <Button
          mode={viewMode === "users" ? "contained" : "outlined"}
          onPress={() => setViewMode("users")}
        >
          Users
        </Button>
        <Button
          mode="contained"
          icon="robot"
          onPress={() => navigation.navigate("ChatWithAIBot")}
        >
          Chat with AI Bot
        </Button>
      </View>
      <View style={styles.sidebar}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${viewMode}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {viewMode === "lawyers" && (
          <View>
            <Button
              mode="outlined"
              onPress={() => setDropdownVisible(!dropdownVisible)}
            >
              {specializationFilter || "All Specializations"}
            </Button>
            {dropdownVisible &&
              [...new Set(lawyers.map((lawyer) => lawyer.specialization))].map(
                (specialization) => (
                  <TouchableOpacity
                    key={specialization}
                    onPress={() => {
                      setSpecializationFilter(specialization);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.dropdownItem}>{specialization}</Text>
                  </TouchableOpacity>
                )
              )}
          </View>
        )}
      </View>
      <View style={styles.content}>
        <FlatList
          data={viewMode === "lawyers" ? filteredLawyers : filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => renderItem({ item, type: viewMode })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  sidebar: { padding: 10, backgroundColor: "#f5f5f5" },
  searchInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  dropdownItem: { padding: 10 },
  content: { flex: 1 },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 3,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemSecondary: { color: "#555" },
  chatButton: { marginLeft: 10 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default ChatsPage;
