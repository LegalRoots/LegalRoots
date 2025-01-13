import { StyleSheet, View, Text, StatusBar } from "react-native";

export default function Employees() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>In Employees</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 30,
    color: "white",
  },
});
