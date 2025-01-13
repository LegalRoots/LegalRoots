import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  ScrollView,
} from "react-native";

import { AuthContext } from "../../src/shared/context/auth";
import io from "socket.io-client";
import { API_URL } from "@env";
const socket = io(`${API_URL}`);
const Post = ({ post, setPosts }) => {
  const { user, setUser, type } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState("");
  const contentRef = useRef(null);

  useEffect(() => {
    const element = contentRef.current;
    if (element.scrollHeight > element.clientHeight) {
      setIsOverflowing(true);
    } else {
      setIsOverflowing(false);
    }
  }, [post.content]);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await fetch(
        `${API_URL}/JusticeRoots/posts/${postId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ author: user._id, authorModel: type }),
        }
      );
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === updatedPost._id ? updatedPost : post
          )
        );
      } else {
        console.error("Error liking post:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePostComment = async (e) => {
    try {
      const response = await fetch(
        `${API_URL}/JusticeRoots/posts/${post._id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newCommentContent,
            author: user._id,
            authorModel: type,
          }),
        }
      );
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((p) => (p._id === updatedPost._id ? updatedPost : p))
        );
        setNewCommentContent("");
      } else {
        console.error("Error posting comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLikeComment = async (postId, commentId) => {
    try {
      const response = await fetch(
        `${API_URL}/JusticeRoots/posts/${postId}/comments/${commentId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ author: user._id, authorModel: type }),
        }
      );
      if (response.ok) {
        const updatedPost = await response.json();

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === updatedPost._id ? updatedPost : post
          )
        );
      } else {
        console.error("Error liking comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const isLiked = post.likes.some((like) => like === user._id);

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <Image
            source={{
              uri:
                post.authorModel === "Employee"
                  ? `data:image/jpeg;base64,${post.author.employee_photo}`
                  : post.authorModel === "Judge"
                  ? `data:image/jpeg;base64,${post.author.judge_photo}`
                  : `${API_URL}/uploads/images/${post.author.photo}`,
            }}
            style={styles.authorAvatar}
          />
          <Text>{post.author.first_name + " " + post.author.last_name}</Text>
          <Text style={styles.roleText}>{post.authorModel}</Text>
        </View>
        <Text style={styles.postTimestamp}>
          {new Date(post.timestamp).toLocaleString()}
        </Text>
      </View>

      <Text style={styles.postContent} ref={contentRef}>
        {post.content}
      </Text>

      {isOverflowing && (
        <TouchableOpacity style={styles.showMore} onPress={toggleContent}>
          <Text>{isExpanded ? "Show Less" : "Show More"}</Text>
        </TouchableOpacity>
      )}

      {post.image && (
        <Image
          source={{ uri: `${API_URL}/${post.image}` }}
          style={styles.postImage}
        />
      )}

      <View style={styles.postInteractions}>
        <TouchableOpacity
          onPress={() => handleLikePost(post._id)}
          style={styles.likeButton}
        >
          <Text style={isLiked ? styles.liked : {}}>❤️</Text>
          <Text>{post.likes.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleComments} style={styles.commentButton}>
          <Text>💬</Text>
          <Text>{post.comments.length}</Text>
        </TouchableOpacity>
      </View>

      {showComments && (
        <View style={styles.commentForm}>
          <TextInput
            placeholder="Add a comment..."
            value={newCommentContent}
            style={styles.commentInput}
            onChange={(e) => setNewCommentContent(e.nativeEvent.text)}
          />
          <Button title="Post" onPress={handlePostComment} />
        </View>
      )}

      {showComments && post.comments.length > 0 && (
        <ScrollView style={styles.postComments}>
          {post.comments.map((comment, index) => (
            <View key={index} style={styles.comment}>
              <View style={styles.commentHead}>
                <Image
                  source={{
                    uri:
                      comment.authorModel === "Employee"
                        ? `data:image/jpeg;base64,${comment.author.employee_photo}`
                        : comment.authorModel === "Judge"
                        ? `data:image/jpeg;base64,${comment.author.judge_photo}`
                        : `${API_URL}/uploads/images/${comment.author.photo}`,
                  }}
                  style={styles.commentAvatar}
                />
                <Text>
                  {comment.author.first_name + " " + comment.author.last_name}
                </Text>
              </View>

              <Text>{comment.content}</Text>
              <Text style={styles.commentTimestamp}>
                {new Date(comment.timestamp).toLocaleString()}
              </Text>

              <TouchableOpacity
                onPress={() => handleLikeComment(post._id, comment._id)}
              >
                <Text
                  style={
                    comment.likes.some((like) => like === user._id)
                      ? styles.liked
                      : {}
                  }
                >
                  ❤️ {comment.likes.length}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = {
  postCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  roleText: {
    backgroundColor: "#FFD700",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  postTimestamp: {
    fontSize: 12,
    color: "#777",
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  showMore: {
    color: "#FFD700",
    textAlign: "right",
    marginTop: 8,
  },
  postImage: {
    width: "100%",
    height: 150,
    objectFit: "cover",
    marginTop: 8,
  },
  postInteractions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  liked: {
    color: "#FFD700",
  },
  commentForm: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  commentInput: {
    width: "80%",
    borderColor: "#FFD700",
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
  },
  postComments: {
    marginTop: 16,
  },
  comment: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  commentHead: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentTimestamp: {
    fontSize: 12,
    color: "#777",
  },
};

export default Post;
