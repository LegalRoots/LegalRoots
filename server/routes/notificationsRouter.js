const express = require("express");
const router = express.Router();
const notificationsController = require("./../controllers/notificationsController");

router.get("/:id", notificationsController.getNotifications);
router.put("/:userId/read/:notificationId", notificationsController.markRead);
module.exports = router;
