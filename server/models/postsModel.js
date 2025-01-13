const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "authorModel",
  },
  authorModel: {
    type: String,
    required: true,
    enum: ["User", "Lawyer", "Employee", "Judge"],
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "likesModel",
    },
  ],
  likesModel: {
    type: String,
    enum: ["User", "Lawyer", "Employee", "Judge"],
  },
  comments: [
    {
      author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "comments.authorModel",
      },
      authorModel: {
        type: String,
        required: true,
        enum: ["User", "Lawyer", "Employee", "Judge"],
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "comments.likesModel",
        },
      ],
      likesModel: {
        type: String,
        enum: ["User", "Lawyer", "Employee", "Judge"],
      },
    },
  ],
  image: {
    type: String,
  },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
