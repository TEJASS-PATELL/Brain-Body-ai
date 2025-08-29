const express = require("express");
const session = require("express-session");
const passport = require("passport");
const MySQLStore = require("express-mysql-session")(session);
const cors = require("cors");
const db = require("./config/db");
const chatRoutes = require("./routers/chatRoutes");
const authRoutes = require("./routers/authroutes");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const app = express();
require("dotenv").config();

require("./config/passport");
require("./models/user");
require("./models/chat_history");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://brain-body-ai.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

const sessionStore = new MySQLStore({}, db);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
