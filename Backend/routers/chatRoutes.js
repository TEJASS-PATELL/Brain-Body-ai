const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const authMiddleware = require("../middleware/auth.middleware"); 

router.post("/start_chat", authMiddleware, chatController.sendAndSaveChat);
router.get("/daily-tasks", chatController.generateDailytask);
router.get("/history", authMiddleware, chatController.getChatSessions);
router.get("/:sessionId", authMiddleware, chatController.getChatBySession);
router.delete("/:sessionId", authMiddleware, chatController.deleteChatSession);

module.exports = router;
