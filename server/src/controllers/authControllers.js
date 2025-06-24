import User from "../models/user.js";
import jwt from "jsonwebtoken";
import BlacklistedToken from "../models/backlistedToken.js";

//Helper to geenrate JWT
const generateToken = (user) => {
    return jwt.sign({
        id: user._id,
        email: user.email,
        role: user.role
    },

        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};


export const registerUser = async (req, res) => {

    const { email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' })

        const user = new User({ email, password, role });
        await user.save();

        const token = generateToken(user);

        res.status(201).json({
            message: "user registered successfully",
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        })
    } catch (err) {
        res.status(500).json({ message: "registration Failed", error: err })
    }

}

//Login user

export const loginUser = async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User doesn't exists! Please register" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "invalid credentials" });

        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);


        // res.status(201).json({
        //     message: "Login successful",
        //     accessToken,
        //     refreshToken,
        //     user: {
        //         id: user._id,
        //         email: user.email,
        //         role: user.role
        //     }
        // });
        // Send refresh token as HttpOnly cookie
        console.log(refreshToken);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.json({
            accessToken, user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        })


    } catch (err) {
        res.status(500).json({ message: "Login Failed", error: err.message })
    }
}

export const refreshAccessToken = async (req, res, next) => {
    const refreshTokenInput = req.cookies.refreshToken;

    if (!refreshTokenInput) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    //check if blacklisted
    const isBlacklisted = await BlacklistedToken.findOne({ token: refreshTokenInput });
    if (!isBlacklisted) {
        return res.status(403).json({ message: 'Refresh token is blacklisted' });
    }

    try {
        const decoded = jwt.verify(refreshTokenInput, process.env.JWT_REFRESH_SECRET)
        const accessToken = generateToken(decoded); //only if is in the payload

        res.status(200).json({ accessToken });
    } catch (err) {
        return res.staus(403).json({ message: "Invalid or Expired Refresh Token" })
    }


};

export const oauthSuccessHandler = (req, res) => {
    const user = req.user;

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Send refreshToken as HttpOnly cookie
    res.cookie('refereshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days

    });

    res.status(200).json({
        message: 'OAuth login successfull',
        accessToken,
        user: {
            id: user._id,
            email: user.eamil,
            role: user.role
        }
    });
};

export const logoutUser = async (req, res) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({ message: 'No Refresh Token found' });
    }

    try {

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        await BlacklistedToken.create({
            token: refreshToken,
            expiresAt: new Date(decoded.exp * 1000), //Expiry from token
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        })

        res.status(200).json({ message: 'Loggedout Successfully' });
    } catch (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });

    };
}