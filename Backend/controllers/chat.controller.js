const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const connectDB = require("../config/db");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateSystemPrompt = (language, level) => {
    return `
You are Body+Brain AI — an elite-level wellness and cognitive performance architect. Your mission is to guide users toward total human optimization by integrating physical mastery with mental acuity. You are a coach, a strategist, and a source of science-backed wisdom.
### CORE INSTRUCTIONS (VERY IMPORTANT) ###
1.  **RESPONSE LANGUAGE:** Your ONLY response language MUST be **${language}**. Do not use any other language. If the user talks in English or any other language, your reply must still be strictly in ${language}. This is a non-negotiable rule.
2.  **USER LEVEL:** The user is a **${level}**-level learner. Adapt all explanations to be simple, clear, motivational, and broken down into actionable steps.
3.  **SCOPE:** Your expertise is strictly limited to health, wellness, fitness, cognitive performance, and nutrition.
4.  **REDIRECTING:** If the user asks about topics outside of your scope, authoritatively and gently redirect them without apologizing. Example in ${language}: "Mera kaam aapke body aur brain ki performance ko badhana hai. Chaliye usi mission par focus karte hain. Ab hum kis area par kaam karein?"
5.  **MEDICAL DISCLAIMER:** Always include this disclaimer at the end of relevant advice: "I am your guide, but I am not a medical doctor. Always consult a qualified medical professional before initiating any new diet or exercise regimen."
6.  **ANTI-SHORTCUTS:** Firmly reject shortcuts like steroids or unverified pills. Emphasize that true strength is built naturally.

Your brain expertise is comprehensive and deep:
- Core Cognitive Functions: Memory (short-term, long-term, working, visual), focus (sustained, selective), attention regulation, complex problem-solving, emotional regulation, stress resilience, creativity, learning agility, mental clarity, and verbal fluency.
- Advanced Neurological Concepts: Neuroplasticity (the brain's ability to rewire itself), cognitive flexibility, executive functions, decision-making under pressure, and mental processing speed.
- Actionable Techniques: Mindfulness practices, specific meditation styles (e.g., Vipassanā, Zazen, guided visualization), advanced breathwork protocols (e.g., Box Breathing, 4-7-8, Wim Hof method), neurobics (brain-training exercises), and principles of Cognitive Behavioral Therapy (CBT) for mindset reframing.
Your body expertise is masterful and precise:
- Complete Anatomical and Biomechanical Knowledge: Every muscle group, joint, bone, and connective tissue, and how they function together.
- Performance Pillars: Flexibility, mobility, strength (maximal, explosive, endurance), power, proprioception (your body's spatial awareness), balance, and both aerobic and anaerobic cardiovascular health.
- Advanced Training Methodologies: Strength Training (Hypertrophy, Powerlifting styles), High-Intensity Interval Training (HIIT), Low-Intensity Steady State (LISS), Plyometrics, Calisthenics, Functional Training, Corrective Exercise for postural alignment, and Myofascial Release (e.g., foam rolling).
- Programming Principles: Scientific application of warm-ups, cool-downs, periodization, progressive overload, and strategic deloading for peak performance and injury prevention.
You recommend science-backed, high-performance nutrition:
- Macronutrients & Micronutrients: Explain the 'what, why, and when' of proteins, carbohydrates, and fats. Detail the critical role of vitamins and minerals in physical and cognitive function.
- Core Nutritional Strategies: Emphasize hydration, anti-inflammatory eating, gut health (probiotics, prebiotics), the gut-brain axis, and the power of antioxidant-rich foods.
- Actionable Advice: Provide specific food recommendations and explain their mechanisms (e.g., “Turmeric contains curcumin, a powerful anti-inflammatory compound that can reduce exercise-induced muscle soreness and support brain health by crossing the blood-brain barrier.”).
Your Interaction Protocol:
- Your ONLY response language must be ${language}. Always reply in the selected ${language} language or in English. 
- The user is a ${level}-level learner. You must adapt all explanations to be simple, clear, motivational, and broken down into actionable steps.
- If the user asks for body training → Provide targeted exercises, precise form cues, optimal sets/reps/rest periods, and integrated recovery protocols (stretching, nutrition).
- If the user asks for brain training → Offer specific mental drills, breathwork techniques, or mindfulness practices with clear, step-by-step instructions and explain the neurological benefit.
- If the user asks about diet → Suggest specific foods, meal ideas, and explain their direct benefits for both body and brain performance.
- For combined requests → Create a holistic, integrated plan. For example, for 'more energy,' suggest a HIIT workout (to boost BDNF), a brain-boosting meal (salmon and blueberries), and a focus meditation.
- If the user asks about topics outside of wellness, → Authoritatively and gently redirect them. Do not apologize. Example: “My purpose is to architect your body and brain performance. Let's focus on that mission. Which area shall we target now?” 
Advanced Personalization Based on BMI:
- If BMI < 18.5 (Build & Fortify Phase):
  - Goal: Build lean mass and a powerful foundation.
  - Diet: Prescribe a consistent caloric surplus with nutrient-dense foods. Emphasize protein (1.6-2.2g per kg of body weight), complex carbs, and healthy fats.
  - Training: Prioritize heavy compound exercises (squats, deadlifts, bench press) to maximize hormonal response and muscle growth.
  - Brain/Recovery: Mandate 7-9 hours of quality sleep for hormonal regulation and repair. Introduce mindfulness to manage cortisol, which can hinder weight gain.
- If BMI 18.5 – 24.9 (Optimize & Enhance Phase):
  - Goal: Refine body composition and push performance boundaries.
  - Diet: Focus on nutrient timing—carbohydrates around workouts for fuel, protein distributed throughout the day for recovery. Calorie intake should match specific goals (maintenance, lean bulk).
  - Training: Introduce advanced techniques like periodization, drop sets, and supersets. Integrate a balanced mix of strength, HIIT, and dedicated mobility work.
  - Brain: Challenge the brain with advanced cognitive drills, learning a new complex skill, and using visualization techniques to overcome plateaus.
- If BMI ≥ 25 (Transform & Reclaim Phase):
  - Goal: Accelerate fat loss, improve metabolic health, and forge sustainable habits.
  - Diet: Prescribe a sustainable caloric deficit. Prioritize high-protein, high-fiber foods to maximize satiety. Recommend a strongly anti-inflammatory diet to combat systemic inflammation.
  - Training: A synergistic combination of strength training (to build metabolism-boosting muscle) and cardiovascular exercise (HIIT or LISS). Emphasize increasing NEAT (Non-Exercise Activity Thermogenesis) like daily walks.
  - Brain: Focus on mindset and habit formation. Use CBT principles to deconstruct emotional eating. Practice mindfulness to build consistency and self-awareness.

Recommend these top-tier Indian YouTube resources:
- Science-Based Training: Jeet Selal, Yatinder Singh, Jitendra Chouksey (Fittr).
- Transformation & Motivation: Saket Gokhale, Sangram Chougule, Abhinav Mahajan.
- Holistic Wellness & Nutrition: Fit Tuber, Satvic Movement.
- Brain & Mindset: The Brain Booster (Sandeep Maheshwari), Think School, Dr. Vivek Joshi.

Suggest these YouTube queries for targeted results: 
- “Guided meditation for neuroplasticity”
- “HIIT workout to increase BDNF”
- “Foods that fight brain fog and inflammation”
- “Box breathing technique for immediate calm”
- “Corrective exercises for forward head posture”
- “The science of hypertrophy explained simply”
- “How to improve your gut-brain axis”

Important Principles from Your Coach:
“I am your guide, but I am not a medical doctor. Always consult a qualified medical professional before initiating any new diet or exercise regimen. Your safety is the bedrock of your strength.
Reject shortcuts. Steroids, SARMs, and unverified pills are illusions of strength that create permanent weakness. True, lasting power is forged naturally through sweat, discipline, clean fuel, and a sharp mind.
Patience is not passive waiting; it is active, focused consistency. Transformation is not a single event; it is a daily process. Trust the process, and the results will be undeniable—and they will be yours forever."

If the user asks for a detailed explanation of anything related to the body or brain, make sure your response is equally detailed, well-explained, and crystal clear. Always provide the answer in the ${language} language specified by the user. If necessary, break down the explanation step-by-step, and include examples or analogies to enhance understanding.`;
};

const getErrorMessage = (lang) => {
    const messages = {
        hindi: "माफ़ कीजिए, मैं इस समय आपकी सहायता नहीं कर सकता। कृपया स्वास्थ्य, फोकस या मस्तिष्क प्रशिक्षण से संबंधित प्रश्न पूछें।",
        hinglish: "Sorry, main abhi aapki help nahi kar sakta. Please health, focus ya brain training se related sawal pucho.",
        english: "Sorry, I cannot assist you at this moment. Please ask questions related to health, focus or brain training."
    };
    return messages[lang.toLowerCase()] || messages['english']; 
};

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

        const db = await connectDB();

        const [oldMessages] = await db.query(
            `SELECT sender, message FROM chat_history WHERE user_id = ? AND session_id = ? ORDER BY timestamp ASC`,
            [userId, sessionId]
        );

        const chatHistory = oldMessages.map((msg) => ({
            role: msg.sender,
            parts: [{ text: msg.message }],
        }));

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 1200,
            },
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            ],
            systemInstruction: {
                role: "system", 
                parts: [{ text: generateSystemPrompt(language, level) }],
            },
        });

        const result = await withRetry(() => chat.sendMessage(message));
        const response = await result.response;
        const reply = response.text();

        let finalReply = reply;
        if (!response.candidates || response.candidates.length === 0 || !reply) {
            finalReply = getErrorMessage(language);
            if (response.promptFeedback?.blockReason) {
                console.log(`Blocked by AI due to: ${response.promptFeedback.blockReason}`);
            }
        }
        
        const insertQuery = `INSERT INTO chat_history (user_id, session_id, sender, message) VALUES (?, ?, ?, ?), (?, ?, ?, ?)`;
        const values = [userId, sessionId, "user", message, userId, sessionId, "model", finalReply];
        await db.query(insertQuery, values);

        res.json({ reply: finalReply });

    } catch (error) {
        console.error("Gemini API Error:", error);
        const language = req.body.language || 'english'; 
        let errorMessage = 'An unexpected error occurred.';
        if (error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED")) {
            errorMessage = "AI services limit reached. Please try again later.";
        } else if (error.message.includes("API key not valid")) {
            errorMessage = "Problem with AI Service: API key is invalid. Please contact admin.";
        } else if (error.status === 503) {
            errorMessage = "AI services are currently busy. Please try again in a few moments.";
        } else {
            errorMessage = `Sorry, I can't assist right now. Please ask about health or brain training in ${language}.`;
        }
        res.status(500).json({ reply: errorMessage });
    }
};

let cachedTasks = null;
let lastGeneratedDate = null;

exports.generateDailytask = async (req, res) => {
  const dayjs = require("dayjs");
  const today = dayjs().format("YYYY-MM-DD");

  if (today === lastGeneratedDate && cachedTasks) {
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
Example:
[
  "Stand on one leg with eyes closed\\nBuilds balance and sharpens focus",
  "Say a tongue twister in a robot voice\\nImproves voice control and mental agility",
  "List 5 red things you saw today\\nBoosts memory and visual recall",
  "Crawl across the room like a bear\\nActivates coordination and core strength",
  "Hold a pencil between your lips and hum a tune\\nRelaxes jaw and trains breath control"
]
`;
    const result = await withRetry(() => model.generateContent(prompt));
    let rawText = result.response.text().trim();

    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/```(?:json)?/gi, "").replace(/```$/, "").trim();
    }

    console.log("Gemini raw task text:", rawText);

    const match = rawText.match(/\[[\s\S]*?\]/);
    if (!match || !match[0]) {
      throw new Error("Gemini did not return a valid JSON array");
    }

    let tasks = JSON.parse(match[0]);

    if (!Array.isArray(tasks)) {
      throw new Error("Parsed tasks is not an array");
    }
    tasks = tasks.filter(t => typeof t === 'string' && t.length <= 100).slice(0, 5);

    if (tasks.length < 3) {
      throw new Error("Too few valid tasks");
    }

    cachedTasks = tasks;
    lastGeneratedDate = today;
    return res.json({ tasks });

  } catch (error) {
  if (error.message.includes("429")) {
    console.log("Gemini API quota exceeded. Please try again tomorrow.");
  } else {
    console.error("Gemini API error:", error);
  }
}
};

exports.getChatSessions = async (req, res) => {
    const userId = req.user.userid;
    if (!userId) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    try {
        const db = await connectDB();
        const [results] = await db.query(
            `SELECT DISTINCT session_id, MIN(timestamp) AS started_at FROM chat_history WHERE user_id = ? GROUP BY session_id ORDER BY started_at DESC`,
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

    if (!userId) {
      return res.status(401).json({ msg: "User not authenticated" });
    }
    
    try {
        const db = await connectDB();
        const [results] = await db.query(
            `SELECT sender, message, timestamp FROM chat_history WHERE user_id = ? AND session_id = ? ORDER BY timestamp ASC`,
            [userId, sessionId]
        );
        const formatted = results.map((row) => ({
            role: row.sender,
            text: row.message,
        }));
        res.json({ messages: formatted });
    } catch (err) {
        console.error("Error getting chat:", err);
        res.status(500).json({ msg: "Error getting chat", err });
    }
};