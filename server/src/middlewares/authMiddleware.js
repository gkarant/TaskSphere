import jwt from 'jsonwebtoken';
import User from '../models/user.js';

//Middleware to verify the JWT token
export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: "Authorization token missing or malformed" })
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password') //check what is - password means
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired Token' })
    }

};

//Middleware to restrict the access by role

export const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied for role : ${req.user.role}` })
        }
        next();
    };
};