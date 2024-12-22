const express = require("express");
const router = express.Router();
const notificationsController = require("./../controllers/notificationsController");

router.get("/:id/:userType", notificationsController.getNotifications);
router.put(
  "/:userId/:userType/read/:notificationId",
  notificationsController.markRead
);
module.exports = router;
