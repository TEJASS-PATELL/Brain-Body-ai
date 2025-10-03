const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const db = require("../config/db");
const dayjs = require("dayjs");
const { generateSystemPrompt, yogaPrompt } = require("../Prompt/BrainBody");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const withRetry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.status === 503) {
      await new Promise(res => setTimeout(res, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

exports.sendAndSaveChat = async (req, res) => {
  try {
    const userId = req.user?.userid;
    const { sessionId, message, language = "english", level = "beginner", yogaMode } = req.body;

    if (!userId) return res.status(401).json({ msg: "User not authenticated" });
    if (!sessionId || !message) return res.status(400).json({ msg: "Missing required fields: sessionId or message" });

    const [oldMessages] = await db.query(
      "SELECT sender, message FROM chat_history WHERE user_id = ? AND session_id = ? ORDER BY timestamp ASC",
      [userId, sessionId]
    );

    const chatHistory = oldMessages.map(msg => ({
      role: msg.sender === "model" ? "model" : "user",
      parts: [{ text: msg.message }],
    }));

    const systemInstruction = yogaMode ? yogaPrompt(language, level) : generateSystemPrompt(language, level);

    const contents = [
      ...chatHistory,
      { role: "user", parts: [{ text: message }] }
    ];

    const result = await withRetry(() =>
      model.generateContent({
        contents: contents,
        systemInstruction: systemInstruction,
        generationConfig: { maxOutputTokens: 2500 },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
      })
    );

    const reply = result.response?.text() || "Sorry, I couldn't generate a response.";

    await db.query(
      "INSERT INTO chat_history (user_id, session_id, sender, message) VALUES (?, ?, ?, ?)",
      [userId, sessionId, "user", message]
    );
    await db.query(
      "INSERT INTO chat_history (user_id, session_id, sender, message) VALUES (?, ?, ?, ?)",
      [userId, sessionId, "model", reply]
    );

    res.json({ reply });
  } catch (error) {
    console.error("500 Internal Server Error in sendAndSaveChat:", error);
    res.status(500).json({
      reply: `Sorry, I can't assist right now in ${req.body.language || "english"}.`,
      error: error.message
    });
  }
};

let cachedTasks = null;
let lastGeneratedTask = null;

exports.generateDailytask = async (req, res) => {
  const todayTask = dayjs().format("YYYY-MM-DD");

  if (cachedTasks && lastGeneratedTask === todayTask) {
    return res.json({ tasks: cachedTasks });
  }

  const defaultTasks = [
    "Take 10 deep breaths to energize your body and mind, improving focus and calm",
    "Balance a book on your head for 1 minute to improve posture and concentration",
    "Name 5 things you are grateful for to boost positivity and mental clarity",
    "Close your eyes and focus on 3 sounds to enhance awareness and inner calm",
    "Stretch arms overhead and rotate shoulders to loosen tension and increase flexibility",
    "Speak a positive affirmation aloud 3 times to boost confidence and motivation"
  ];

  try {
    const prompt = `
      You are a creative wellness coach AI.
      Create 5-6 short daily challenges for mind and body.
      Each task should be a single line, simple, practical, and slightly longer.
      Respond with a JSON array of strings only.
    `;

    const result = await withRetry(() =>
      model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
    );

    let tasks = [];
    try {
      tasks = JSON.parse(result.response.text());
      if (!Array.isArray(tasks)) tasks = defaultTasks;
    } catch {
      tasks = defaultTasks;
    }

    tasks = tasks.slice(0, 6);
    cachedTasks = tasks;
    lastGeneratedTask = todayTask;
    res.json({ tasks });
  } catch (err) {
    console.error("Error generating daily tasks:", err);
    cachedTasks = defaultTasks;
    lastGeneratedTask = todayTask;
    res.json({ tasks: defaultTasks });
  }
};

exports.getChatSessions = async (req, res) => {
  const userId = req.user.userid;
  if (!userId) return res.status(401).json({ msg: "User not authenticated" });

  try {
    const [results] = await db.query(
      `SELECT DISTINCT session_id, MIN(timestamp) AS started_at
       FROM chat_history
       WHERE user_id = ?
       GROUP BY session_id
       ORDER BY started_at DESC`,
      [userId]
    );
    res.json({ history: results });
  } catch (err) {
    res.status(500).json({ msg: "Error getting sessions", err });
  }
};

exports.getChatBySession = async (req, res) => {
  const { sessionId } = req.params;
  const userId = req.user.userid;
  if (!userId) return res.status(401).json({ msg: "User not authenticated" });

  try {
    const [results] = await db.query(
      `SELECT sender, message, timestamp
       FROM chat_history
       WHERE user_id = ? AND session_id = ?
       ORDER BY timestamp ASC`,
      [userId, sessionId]
    );
    const formatted = results.map(row => ({ role: row.sender, text: row.message }));
    res.json({ messages: formatted });
  } catch (err) {
    res.status(500).json({ msg: "Error getting chat", err });
  }
};

exports.deleteChatSession = async (req, res) => {
  const userId = req.user.userid;
  const { sessionId } = req.params;
  if (!userId) return res.status(401).json({ msg: "User not authenticated" });
  if (!sessionId) return res.status(400).json({ msg: "Session ID is required" });

  try {
    await db.query(
      "DELETE FROM chat_history WHERE user_id = ? AND session_id = ?",
      [userId, sessionId]
    );
    res.json({ msg: "Chat session deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete chat session", err });
  }
};
