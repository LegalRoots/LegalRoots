import { StyleSheet, View, Text, StatusBar } from "react-native";

export default function Courts() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>In Courts</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 30,
    color: "white",
  },
});
