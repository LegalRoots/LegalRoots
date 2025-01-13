import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { API_URL } from "@env";
const RecommendedLawyersSlider = ({
  handleShowDetails,
  handleHireLawyer,
  recommendedLawyers,
}) => {
  if (!recommendedLawyers || recommendedLawyers.length === 0) {
    return (
      <Text style={styles.noLawyersText}>
        No recommended lawyers available for this specialization.
      </Text>
    );
  }

  const renderLawyer = ({ item: lawyer }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            `${API_URL}/uploads/images/${lawyer.photo}` ||
            "/default-profile.png",
        }}
        style={styles.lawyerImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.lawyerName}>
          {lawyer.first_name} {lawyer.last_name}
        </Text>
        <Text style={styles.lawyerSpecialization}>{lawyer.specialization}</Text>
        <Text style={styles.lawyerExperience}>
          {lawyer.yearsOfExperience} years of experience
        </Text>
        <Text style={styles.lawyerPrice}>${lawyer.consultation_price}/hr</Text>
        <Text style={styles.lawyerRating}>⭐ {lawyer.assessment}</Text>
        <Text style={styles.lawyerCases}>🎉 {lawyer.wonCases} won cases</Text>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={handleShowDetails(lawyer)}
        >
          <Text style={styles.buttonText}>More Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.hireButton}
          onPress={handleHireLawyer(lawyer._id)}
        >
          <Text style={styles.buttonText}>Hire Lawyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Lawyers</Text>

      <FlatList
        data={recommendedLawyers}
        renderItem={renderLawyer}
        keyExtractor={(item) => item._id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },
  noLawyersText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  scrollContainer: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  card: {
    width: 280,
    marginRight: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  lawyerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 20,
    alignSelf: "center",
  },
  cardContent: {
    padding: 15,
  },
  lawyerName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  lawyerSpecialization: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
  lawyerExperience: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    marginVertical: 5,
  },
  lawyerPrice: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
  },
  lawyerRating: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
  },
  lawyerCases: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    marginBottom: 15,
  },
  detailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ffbf00",
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  hireButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#ffbf00",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 14,
    color: "#fff",
  },
});

export default RecommendedLawyersSlider;
