import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from 'dotenv';
import User from "../models/user.js";
import { refreshAccessToken } from "../controllers/authControllers";

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
            GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await User.findOne({ goohleId: profile.id });

                if (existingUser) return done(null, existingUser);

                const newUser = await User.create({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    role: 'user'
                });

                done(null, newUser);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

// (Optional) if using session-based auth
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => done(null, user));
});

