const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const passport = require("passport");
const authMiddleware = require("../middleware/auth.middleware");
const jwt = require("jsonwebtoken"); 

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/check", authController.check);
router.post("/logout", authMiddleware, authController.logout);
router.get("/check-session", authController.check_session);
router.get("/userinfo", authMiddleware, authController.user_info);
router.post("/update_detail", authMiddleware, authController.update_detail);
router.get("/get_detail", authMiddleware, authController.get_detail);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false, // No session stored, we’re using JWT
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login", 
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign({ userid: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect("http://localhost:5173/chatbot");
  }
);

module.exports = router;
