const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const db = require("../config/db");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const dayjs = require("dayjs");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const { generateSystemPrompt, yogaPrompt } = require("../Prompt/BrainBody")

const withRetry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.status === 503) {
      console.warn(`Retrying due to 503 Service Unavailable. Retries left: ${retries}`);
      await new Promise(res => setTimeout(res, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

exports.sendAndSaveChat = async (req, res) => {
  try {
    const userId = req.user.userid;
    const { sessionId, message, language = 'english', level = 'beginner' } = req.body;

    if (!userId || !sessionId || !message) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const [oldMessages] = await db.query(
      `SELECT sender, message FROM chat_history WHERE user_id = ? AND session_id = ? ORDER BY timestamp ASC`,
      [userId, sessionId]
    );

    const chatHistory = oldMessages.map((msg) => ({
      role: msg.sender,
      parts: [{ text: msg.message }],
    }));

    let systemPrompt;
    const isYogaMode = req.session?.yogaMode === true || req.session?.yogaMode === "true";

    console.log(" YogaMode in session:", req.session?.yogaMode, "Type:", typeof req.session?.yogaMode);

    if (isYogaMode) {
      console.log("Yoga Prompt SELECTED");
      systemPrompt = yogaPrompt(req.session.language || language, req.session.level || level);
    } else {
      console.log("BrainBody Prompt SELECTED");
      systemPrompt = generateSystemPrompt(req.session.language || language, req.session.level || level);
    }

    console.log("Final system prompt preview:", systemPrompt.substring(0, 300));

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: { maxOutputTokens: 1500 },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
    });

    const result = await withRetry(() => chat.sendMessage(message));
    const reply = result.response.text() || getErrorMessage(language);

    await db.query(
      `INSERT INTO chat_history (user_id, session_id, sender, message) VALUES (?, ?, ?, ?), (?, ?, ?, ?)`,
      [userId, sessionId, "user", message, userId, sessionId, "model", reply]
    );

    res.json({ reply });
  } catch (error) {
    console.error("Gemini API Error:", error);
    const language = req.body.language || 'english';
    res.status(500).json({ reply: `Sorry, I can't assist right now in ${language}.` });
  }
};

let cachedTasks = null;
let lastGeneratedKey = null;

exports.generateDailytask = async (req, res) => {
  const now = dayjs();
  const taskKey = now.hour() >= 5 ? now.format("YYYY-MM-DD") : now.subtract(1, "day").format("YYYY-MM-DD");

  if (taskKey === lastGeneratedKey && cachedTasks) {
    return res.json({ tasks: cachedTasks });
  }

  try {
    const prompt = `
You are a fun and creative wellness coach AI.
Your job is to create 6 to 8 short, unique daily challenges that wake up both the mind and the body.
Instructions:
- Each task must be short, practical, and exciting
- Format each task as a single string with 2 lines — use \\n to break the lines
- Don't include boring tips like "drink water" or "go for a walk"
- Mix it up! Use ideas like balance, memory, focus, body control, posture, breathing, voice, etc.
- Respond with a **pure JSON array** of exactly 5 strings — no extra text or explanation
`;

    const result = await withRetry(() => model.generateContent(prompt));
    let rawText = result.response.text().trim();

    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/```(?:json)?/gi, "").replace(/```$/, "").trim();
    }

    const match = rawText.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("Gemini did not return valid JSON");

    let tasks;
    try {
      tasks = JSON.parse(match[0]);
    } catch (parseErr) {
      console.error("JSON.parse failed, rawText:", rawText);
      throw new Error("Failed to parse Gemini JSON");
    }

    if (!Array.isArray(tasks)) throw new Error("Tasks is not an array");

    tasks = tasks
      .filter(t => typeof t === "string" && t.length > 5 && t.length <= 120)
      .slice(0, 5);

    if (tasks.length < 3) throw new Error("Too few valid tasks");

    cachedTasks = tasks;
    lastGeneratedKey = taskKey;

    return res.json({ tasks });
  } catch (error) {
    console.error("Daily tasks generation failed:", error.message, error.stack);
    return res.status(500).json({
      msg: "Failed to generate daily tasks",
      fallback: [
        "Stand tall and take 10 deep breaths\nCalms mind and energizes body",
        "Balance a book on your head for 1 min\nImproves posture and focus",
        "Name 5 things you are grateful for\nBoosts positivity and mindfulness",
      ]
    });
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
    console.error("Error in getChatSessions:", err);
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
    console.error("Error getting chat:", err);
    res.status(500).json({ msg: "Error getting chat", err });
  }
};