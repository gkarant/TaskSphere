import https from 'https';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import app from "./src/app.js";
import logger from './src/utils/logger.js';
import { connectDB, mongoose } from "./src/config/db.js";

dotenv.config();

//SSl setup
const __dirname = path.resolve();
const sslOption = {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.cert')//after implementing graceful shutdown
    // key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
    // cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.cert')),

}

// const PORT = process.env.PORT || 5000;
// https.createServer(sslOption, app).listen(PORT, () => console.log(`server is running on port ${PORT}`)); //chnaged during graceful shutdown omplementation

const PORT = process.env.PORT || 8444;
const server = https.createServer(sslOption, app);

//connect to DB and start server

const startServer = async () => {
    try {

        await connectDB();
        server.listen(PORT, () => {
            logger.info(`server running at http://localhost:${PORT}`);
        })

    } catch (err) {
        logger.error('Failed to start server:', err)
        process.exit(1);

    }
};

startServer();

//Graceful shutdown

const shutdown = (signal) => {
    logger.info(`\nReceived ${signal}. Shutting down...`);
    server.close(() => {
        logger.info('HTTP Server closed.');
        mongoose.connection.close(false, () => {
            logger.info('MongoDB connection closed.');
            process.exit(0);
        });
    });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
