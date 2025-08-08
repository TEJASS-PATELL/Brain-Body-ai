const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const authMiddleware = require("../middleware/auth.middleware"); 

router.post("/", authMiddleware, chatController.sendAndSaveChat);
router.get("/daily-tasks", chatController.generateDailytask);
router.get("/history", authMiddleware, chatController.getChatSessions);
router.get("/:sessionId", authMiddleware, chatController.getChatBySession);

module.exports = router;
