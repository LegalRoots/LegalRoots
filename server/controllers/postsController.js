const Post = require("../models/postsModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryController");
const multer = require("multer");

exports.getAllPosts = catchAsync(async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate(
        "author",
        "first_name last_name photo judge_photo employee_photo "
      )
      .populate(
        "likes",
        "first_name last_name likes photo judge_photo employee_photo"
      )
      .populate(
        "comments.author",
        "first_name last_name likes photo judge_photo employee_photo"
      )
      .populate(
        "comments.likes",
        "first_name last_name likes photo judge_photo employee_photo"
      )
      .lean()
      .exec();

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
  }
});

exports.likeComment = catchAsync(async (req, res, next) => {
  const { postID, commentID } = req.params;
  const { author } = req.body;

  const post = await Post.findById(postID);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const comment = post.comments.id(commentID);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  if (!comment.likes.some((like) => like.equals(author))) {
    comment.likes.push(author);
  } else {
    comment.likes = comment.likes.filter((like) => !like.equals(author));
  }

  await post.save();

  const updatedPost = await Post.findById(postID)
    .populate([
      {
        path: "author",
        select: "first_name last_name photo role employee_photo judge_photo",
      },
      {
        path: "likes",
        select: "first_name last_name photo employee_photo judge_photo",
      },
      {
        path: "comments.author",
        select: "first_name last_name photo employee_photo judge_photo",
      },
      {
        path: "comments.likes",
        select: "first_name last_name photo employee_photo judge_photo",
      },
    ])
    .lean();

  if (updatedPost.authorModel === "Employee") {
    updatedPost.author.employee_photo =
      updatedPost.author.employee_photo.toString("base64");
  } else if (updatedPost.authorModel === "Judge") {
    updatedPost.author.judge_photo =
      updatedPost.author.judge_photo.toString("base64");
  }

  return res.status(200).json(updatedPost);
});

exports.likePost = catchAsync(async (req, res, next) => {
  const { postID } = req.params;
  const { author } = req.body;

  const post = await Post.findById(postID);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (!post.likes.some((like) => like.equals(author))) {
    post.likes.push(author);
  } else {
    post.likes = post.likes.filter((like) => !like.equals(author));
  }

  await post.save();

  const updatedPost = await Post.findById(postID)
    .populate([
      {
        path: "author",
        select: "first_name last_name photo role employee_photo judge_photo",
      },
      {
        path: "likes",
        select: "first_name last_name photo employee_photo judge_photo",
      },
      {
        path: "comments.author",
        select: "first_name last_name photo employee_photo judge_photo",
      },
      {
        path: "comments.likes",
        select: "first_name last_name photo employee_photo judge_photo",
      },
    ])
    .lean();

  return res.status(200).json(updatedPost);
});

exports.addPost = catchAsync(async (req, res, next) => {
  try {
    const { content } = req.body;
    const userId = req.body.user;

    let Model = req.body.userModel;

    if (Model === "Admin") {
      Model = "Employee";
    }

    const newPost = new Post({
      author: userId,
      content,
      authorModel: Model,
    });

    if (req.file) {
      newPost.image = req.file.path;
    }

    const savedPost = await newPost.save();
    await savedPost.populate([
      {
        path: "author",
        select: "first_name last_name photo role employee_photo judge_photo",
      },
      {
        path: "likes",
        select: "first_name last_name photo employee_photo judge_photo",
      },
      {
        path: "comments.author",
        select: "first_name last_name photo employee_photo judge_photo",
      },
      {
        path: "comments.likes",
        select: "first_name last_name photo employee_photo judge_photo",
      },
    ]);
    res.status(201).json(savedPost);
  } catch (err) {
    console.log(err);
  }
});
exports.addComment = catchAsync(async (req, res, next) => {
  try {
    const { postID } = req.params;
    const { author, content } = req.body;
    let Model = req.body.authorModel;
    if (Model === "Admin") {
      Model = "Employee";
    }

    const post = await Post.findById(postID);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ author, authorModel: Model, content });
    await post.save();

    // Fetch updated post with `.lean()` for the response
    const updatedPost = await Post.findById(postID)
      .populate([
        {
          path: "author",
          select: "first_name last_name photo role employee_photo judge_photo",
        },
        {
          path: "likes",
          select: "first_name last_name photo employee_photo judge_photo",
        },
        {
          path: "comments.author",
          select: "first_name last_name photo employee_photo judge_photo",
        },
        {
          path: "comments.likes",
          select: "first_name last_name photo employee_photo judge_photo",
        },
      ])
      .lean();

    res.status(201).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
});
