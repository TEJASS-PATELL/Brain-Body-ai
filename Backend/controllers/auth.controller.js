const connectDB = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ msg: "All fields are required" });

  try {
    const db = await connectDB();

    const [existingUsers] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    const token = jwt.sign({ userid: result.insertId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ msg: "User Created", userId: result.insertId });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ msg: "Signup failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await connectDB();
    const [results] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (results.length === 0)
      return res.status(400).json({ msg: "User does not exist" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ userid: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      msg: "Logged in successfully",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });
  res.status(200).json({ msg: "Logged out successfully" });
};

exports.update_detail = (req, res) => {
  const { language, level } = req.body;

  if (!language || !level)
    return res.status(400).json({ message: "Language and level are required" });

  if (!req.user)
    return res.status(401).json({ message: "Not authenticated" });
  
  req.session.language = language;
  req.session.level = level;
  req.session.userId = req.user.userid; 

  console.log("Session SET:", language, level);
  res.json({ message: `Preferences set: ${language} (${level})` });
};

exports.get_detail = (req, res) => {
  if (!req.user) {
    console.log("Not authenticated, returning default details.");
    return res.json({ id: null, language: "", level: "" });
  }
  
  const userId = req.user.userid;
  const language = req.session?.language || "";
  const level = req.session?.level || "";
  
  console.log("User details fetched:", language, level, "userId:", userId);
  res.json({ id: userId, language, level });
};


exports.check_session = (req, res) => {
  res.json({
    language: req.session?.language || "",
    level: req.session?.level || "",
  });
};

exports.user_info = async (req, res) => {
  try {
    const userId = req.user.userid;
    const db = await connectDB();

    const [rows] = await db.execute("SELECT name, email FROM users WHERE id = ?", [userId]);
    if (rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({ name: rows[0].name, email: rows[0].email });
  } catch (err) {
    console.error("User fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch user info" });
  }
};

exports.check = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: "Not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ msg: "Logged in", user: decoded });
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};


