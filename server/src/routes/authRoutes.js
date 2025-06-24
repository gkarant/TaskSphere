import express from 'express';

import { registerUser, loginUser, refreshAccessToken, logoutUser, oauthSuccessHandler } from "../controllers/authControllers.js";

import passport from 'passport';

const router = express.Router();

// --- Local Authentication Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logoutUser);

// --- Google OAuth2 ---

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), oauthSuccessHandler // Generate JWT and redirect/send it
);

export default router;