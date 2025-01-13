import React, { useState, useContext, useRef, useEffect } from "react";
import "./Post.css";
import { AuthContext } from "../../../shared/context/auth";
import io from "socket.io-client";
const socket = io("http://localhost:5000");
const Post = ({ post, setPosts }) => {
  const { user, setUser, type } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);
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
        `http://localhost:5000/JusticeRoots/posts/${postId}/like`,
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

  const handlePostComment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const content = formData.get("content");
    try {
      const response = await fetch(
        `http://localhost:5000/JusticeRoots/posts/${post._id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
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
        e.target.reset();
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
        `http://localhost:5000/JusticeRoots/posts/${postId}/comments/${commentId}/like`,
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

  const isLiked = post.likes.some((like) => {
    return like === user._id;
  });

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="author-info">
          <img
            src={
              `
              ${
                post.authorModel === "Employee"
                  ? `data:image/jpeg;base64,${post.author.employee_photo}`
                  : post.authorModel === "Judge"
                  ? `data:image/jpeg;base64,${post.author.judge_photo}`
                  : `http://localhost:5000/uploads/images/${post.author.photo}`
              }` || "/images/default.png"
            }
            alt={`${post.author.first_name}'s avatar`}
            className="author-avatar"
          />
          <p>
            {post.author.first_name + " " + post.author.last_name}{" "}
            <span className={"role-" + post.authorModel}>
              {post.authorModel}
            </span>
          </p>
        </div>
        <div className="post-info">
          <span className="post-timestamp">
            {new Date(post.timestamp).toLocaleString()}
          </span>
        </div>
      </div>
      <p
        ref={contentRef}
        className={`post-content ${isExpanded ? "expanded" : ""}`}
      >
        {post.content}
      </p>
      {isOverflowing && (
        <button className="show-more" onClick={toggleContent}>
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}

      {post.image && (
        <img
          src={`http://localhost:5000/${post.image}`}
          alt="post"
          className="post-image"
        />
      )}

      <div className="post-interactions">
        <span className="post-likes">
          <span
            onClick={() => {
              handleLikePost(post._id);
            }}
            className={`material-symbols-outlined ${isLiked ? "liked" : ""}`}
          >
            favorite
          </span>
          {post.likes.length}{" "}
          <span
            onClick={toggleComments}
            className="comments material-symbols-outlined"
          >
            tooltip_2
          </span>
          <span>{post.comments.length}</span>
        </span>
      </div>
      {showComments && (
        <form onSubmit={handlePostComment} className="comment-form">
          <img
            className="comment-img"
            src={
              `
              ${
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
                  : `http://localhost:5000/uploads/images/${user.photo}`
              }` || "/images/default.png"
            }
            alt=""
          />
          <input
            type="text"
            name="content"
            placeholder="Add a comment..."
            className="comment-input"
          />
          <button type="submit" className="post-button">
            <i className="fa-solid fa-location-arrow"></i>
          </button>{" "}
        </form>
      )}
      {showComments && post.comments.length > 0 && (
        <div className="post-comments">
          {post.comments.map((comment, index) => (
            <div key={index} className="comment">
              <div className="comment-head">
                <img
                  src={
                    `
                      ${
                        comment.authorModel === "Employee"
                          ? `data:image/jpeg;base64,${comment.author.employee_photo}`
                          : comment.authorModel === "Judge"
                          ? `data:image/jpeg;base64,${comment.author.judge_photo}`
                          : `http://localhost:5000/uploads/images/${comment.author.photo}`
                      }` || "/images/default.png"
                  }
                  alt="avatar"
                  className="comment-avatar"
                />
                <strong>
                  {comment.author.first_name + " " + comment.author.last_name}{" "}
                </strong>
              </div>

              <p className="comment-msg">{comment.content}</p>
              <span className="comment-timestamp">
                {new Date(comment.timestamp).toLocaleString()}
              </span>
              <div className="comment-likes">
                <span
                  onClick={() => {
                    handleLikeComment(post._id, comment._id);
                  }}
                  className={`material-symbols-outlined ${
                    comment.likes.some((like) => like === user._id)
                      ? "liked"
                      : ""
                  }`}
                >
                  favorite
                </span>
                <span>{comment.likes.length} </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {showComments && post.comments.length === 0 && (
        <div className="no-comments">
          <p>No comments yet.</p>
        </div>
      )}
    </div>
  );
};

export default Post;
