import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import {
  AzureOpenAIConfig,
  user,
  assistant,
  REGENERATION_TEXT,
  ALERT_TIMEOUT,
} from "./data";

async function getAIResponse(messages) {
  const params = {
    model: AzureOpenAIConfig.deployment,
    messages,
    max_tokens: 1000,
    temperature: 0.7,
  };
  const endpoint =
    "https://public-api.devexpress.com/demo-openai/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-02-01";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AzureOpenAIConfig.apiKey}`,
      },
      body: JSON.stringify(params),
    });
    const data = await response.json();

    return data.choices[0]?.message?.content || "No response from AI.";
  } catch (error) {
    console.error("Failed to fetch AI response:", error.message);
    throw error;
  }
}

export default function ChatBot() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function addMessage(role, content) {
    const newMessage = {
      id: Date.now().toString(),
      role,
      content,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }

  async function handleSendMessage() {
    if (!inputMessage.trim()) return;

    addMessage("user", inputMessage);
    setInputMessage("");
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse([
        ...messages,
        { role: "user", content: inputMessage },
      ]);
      addMessage("assistant", aiResponse);
    } catch (error) {
      Alert.alert("Error", "Failed to get a response from AI.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button title="Back" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>ChatBot</Text>
      </View>

      {/* Chat List */}
      <FlatList
        style={styles.chatList}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.role === "user"
                ? styles.userMessage
                : styles.assistantMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
      />

      {/* Input Box */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your message..."
          value={inputMessage}
          onChangeText={setInputMessage}
          editable={!isLoading}
        />
        <Button title="Send" onPress={handleSendMessage} disabled={isLoading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 64,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#6200ee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  chatList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#e0e0e0",
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#6200ee",
  },
  messageText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
