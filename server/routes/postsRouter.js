const express = require("express");
const postsController = require("./../controllers/postsController");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });
router.post("/", upload.single("image"), postsController.addPost);

router.get("/", postsController.getAllPosts);
router.post("/:postID/comments/:commentID/like", postsController.likeComment);
router.post("/:postID/like", postsController.likePost);
router.post("/:postID/comments", postsController.addComment);

module.exports = router;
