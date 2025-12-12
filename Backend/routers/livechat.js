const express = require("express");
const router = express.Router();
const { AccessToken } = require("livekit-server-sdk");
require("dotenv").config();
const auth = require("../middleware/auth.middleware");

router.post("/token", auth, (req, res) => {
    const userId = req.user.userid;
    const room = "voice-room";

    try {
        const at = new AccessToken(
            process.env.LIVEKIT_API_KEY,
            process.env.LIVEKIT_API_SECRET,
            { identity: userId, ttl: "10m" }
        );

        at.addGrant({
            roomJoin: true,
            room,
            canPublish: true,
            canSubscribe: true,
        });

        return res.json({ token: at.toJwt(), room });

    } catch (e) {
        return res.status(500).json({ error: "Token error" });
    }
});

module.exports = router;
