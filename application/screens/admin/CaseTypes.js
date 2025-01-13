import { StyleSheet, View, Text, StatusBar } from "react-native";

export default function Cases() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>In Case Types</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blueviolet",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 30,
    color: "white",
  },
});
