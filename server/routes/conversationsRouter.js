const express = require("express");
const router = express.Router();
const conversationsController = require("./../controllers/conversationsController");

router.get("/:userId", conversationsController.getUserConversations);

router.get(
  "/:conversationId/messages",
  conversationsController.getConversationMessages
);
router.post("/:conversationId/messages", conversationsController.sendMessage);
module.exports = router;
