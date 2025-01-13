import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  IconButton,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../../src/shared/context/auth";
import * as ImagePicker from "expo-image-picker";
import Post from "./Post";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { API_URL } from "@env";
import * as FileSystem from "expo-file-system";
const MainFeed = () => {
  const { user, type } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);

  const handleNewPostChange = (e) => {
    setNewPostContent(e.nativeEvent.text);
  };

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      return;
    }
    setNewPostImage(result);
  };

  const handlePostSubmit = async () => {
    const formData = new FormData();
    formData.append("content", newPostContent);
    if (newPostImage) {
      const { uri, fileName, type } = newPostImage.assets[0];
      formData.append("image", {
        uri,
        name: fileName,
        type,
      });
    }

    formData.append("userModel", type);
    formData.append("user", user._id);

    const response = await fetch(`${API_URL}/JusticeRoots/posts`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const newPost = await response.json();
      if (type === "Admin") {
        newPost.author.employee_photo = btoa(
          String.fromCharCode(...new Uint8Array(user.employee_photo.data))
        );
      } else if (type === "Judge") {
        newPost.author.judge_photo = btoa(
          String.fromCharCode(...new Uint8Array(user.judge_photo.data))
        );
      }
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setNewPostContent("");
      setNewPostImage(null);
    } else {
      console.error("Error creating post:", response.statusText);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/JusticeRoots/posts`);
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.form}>
          <View style={styles.header}>
            <Image
              source={{
                uri: `${
                  type === "Admin"
                    ? `data:image/jpeg;base64,${btoa(
                        String.fromCharCode(
                          ...new Uint8Array(user.employee_photo.data)
                        )
                      )}`
                    : type === "Judge"
                    ? `data:image/jpeg;base64,${btoa(
                        String.fromCharCode(
                          ...new Uint8Array(user.judge_photo.data)
                        )
                      )}`
                    : `${API_URL}/uploads/images/${user.photo}`
                }`,
              }}
              style={styles.avatar}
            />
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              value={newPostContent}
              onChange={handleNewPostChange}
              placeholder="What's on your mind?"
            />
          </View>
          <View style={styles.footer}>
            <AntDesign
              onPress={handleImageUpload}
              name="camera"
              size={24}
              color="black"
            />
            <Button title="Post" onPress={handlePostSubmit} />
          </View>
        </View>
        {posts.length === 0 ? (
          <Text style={styles.noPosts}>No posts available.</Text>
        ) : (
          <View>
            {posts.map((post) => (
              <Post key={post._id} setPosts={setPosts} post={post} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  formContainer: {
    maxWidth: 600,
    marginHorizontal: "auto",
    paddingVertical: 16,
  },
  form: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  textInput: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
  },
  noPosts: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
});

export default MainFeed;
