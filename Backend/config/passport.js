const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const connectDB = require("./db");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = await connectDB();
        const email = profile.emails[0].value;
        const name = profile.displayName;

        const [existing] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        let user;
        if (existing.length > 0) {
          user = existing[0];
        } else {
          const [result] = await db.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, ""] 
          );
          user = { id: result.insertId, name, email };
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = await connectDB();
    const [users] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    done(null, users[0]);
  } catch (err) {
    done(err, null);
  }
});
