import express from "express";
import mongoose, { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
//import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import helmet from 'helmet'; //Secure HTTP headers
import morgan from 'morgan';//Track every incoming request for auditing/debugging.
import xss from 'xss-clean';// Prevents Cross-Site Scripting (XSS) attacks.
import compression from 'compression';//Improves performance by compressing response bodies.
import mongoSanitize from 'express-mongo-sanitize';//Prevents MongoDB Operator Injection (e.g., $gt, $or, etc.)
import { winstonStream } from "./utils/logger.js";
import rateLimit from 'express-rate-limit';//Prevents abuse and brute-force attacks.
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config(); //Keep sensitive config (DB URLs, JWT secret, etc.) out of your code.

//connectDB();

const app = express();



//middlewares
//secure headers
app.use(helmet());

//CORS setup
app.use(cors()); //Controls which domains can access your API.
// app.use(cors({
//     origin: 'http://your-frontend-domain.com', // allow specific frontend
//     credentials: true,
//   }));

//rate limiting
const limiter = rateLimit({
    windowMs: 60 * 60 * 100,
    max: 100,
    message: 'Too many requests, please try again later'
});
app.use(limiter);

//body parser
app.use(express.json());

app.use(compression());

app.use(xss());

//// 6. Sanitize MongoDB input
app.use(mongoSanitize());

//Request logging
app.use(morgan('combined', { stream: winstonStream }))

// app.use((req, res, next) => {
//     console.log('REQ QUERY:', req.query); // or use winston to log
//     next();
// });
//Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => res.send('API is running'));

//error handler
app.use(errorHandler);

export default app;

