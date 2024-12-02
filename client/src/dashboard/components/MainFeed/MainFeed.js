import React, { useState, useEffect, useContext } from "react";
import Post from "../Post/Post";
import "./MainFeed.css";
import { AuthContext } from "../../../shared/context/auth";
const MainFeed = () => {
  const { user } = useContext(AuthContext);
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
    const formData = new FormData(e.target);
    formData.append("content", newPostContent);
    if (newPostImage) {
      formData.append("image", newPostImage);
    }
    formData.append("user", user._id);
    const response = await fetch("/JusticeRoots/posts", {
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
          "http://localhost:3000/JusticeRoots/posts"
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
    return <p>Loading...</p>;
  }

  return (
    <div className="main-feed">
      <form
        encType="multipart/form-data"
        onSubmit={handlePostSubmit}
        className="new-post-form"
      >
        <div className="newPost">
          <img
            src={"/images/" + user.photo}
            alt="User"
            className="new-post-user-image"
          />
          <textarea
            value={newPostContent}
            onChange={handleNewPostChange}
            placeholder="What's on your mind?"
            required
            className="new-post-textarea"
            rows="3"
          />
        </div>

        <div className="new_footer">
          <label htmlFor="image-upload" className="image-upload-label">
            <i className="fa-solid fa-image"></i>
          </label>
          <input
            type="file"
            id="image-upload"
            onChange={handleImageUpload}
            className="new-post-image-upload"
            style={{ display: "none" }}
          />
          <button type="submit" className="post-button">
            <i className="fa-solid fa-location-arrow"></i>
          </button>{" "}
        </div>
      </form>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <Post key={post._id} setPosts={setPosts} post={post} />
        ))
      )}
    </div>
  );
};

export default MainFeed;
