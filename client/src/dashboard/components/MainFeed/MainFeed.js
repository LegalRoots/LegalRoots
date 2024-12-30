import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Avatar,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import SendIcon from "@mui/icons-material/Send";
import Post from "../Post/Post";
import { AuthContext } from "../../../shared/context/auth";
import Grid from "@mui/material/Grid2";

const MainFeed = () => {
  const { user, type } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);

  const handleNewPostChange = (e) => {
    setNewPostContent(e.target.value);
  };

  const handleImageUpload = (e) => {
    setNewPostImage(e.target.files[0]);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", newPostContent);
    if (newPostImage) {
      formData.append("image", newPostImage);
    }
    formData.append("userModel", type);
    formData.append("user", user._id);

    const response = await fetch("http://localhost:5000/JusticeRoots/posts", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const newPost = await response.json();
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
        const response = await fetch(
          "http://localhost:5000/JusticeRoots/posts"
        );
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 10 }}>
        <Box sx={{ maxWidth: 600, p: 2 }}>
          <Box
            component="form"
            onSubmit={handlePostSubmit}
            sx={{ mb: 3, boxShadow: 2, p: 2, borderRadius: 2 }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar src={`/images/${user.photo}`} alt="User" sx={{ mr: 2 }} />
              <TextField
                variant="outlined"
                fullWidth
                multiline
                minRows={3}
                value={newPostContent}
                onChange={handleNewPostChange}
                placeholder="What's on your mind?"
                required
              />
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <IconButton color="primary" component="label">
                <PhotoCamera />
                <input type="file" hidden onChange={handleImageUpload} />
              </IconButton>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                endIcon={<SendIcon />}
              >
                Post
              </Button>
            </Box>
          </Box>

          {posts.length === 0 ? (
            <Typography align="center">No posts available.</Typography>
          ) : (
            <Box>
              {posts.map((post) => (
                <Post key={post._id} setPosts={setPosts} post={post} />
              ))}
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default MainFeed;
