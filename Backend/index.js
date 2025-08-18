require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport"); 
require("./config/passport"); 
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routers/authroutes");
const chatRoutes = require("./routers/chatRoutes");
const db = require("./config/db");
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], 
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, 
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
