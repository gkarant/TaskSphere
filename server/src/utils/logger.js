//import { createLogger, format, transports } from 'winston';
import winston from 'winston';
import path from 'path';
import fs from 'fs';

//ensure logs directory exists

const logDir = path.resolve('logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}


//create winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
        // winston.format.errors({ stack: true }),
        // winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        // new transports.File({ filename: 'logs/combined.log' }), //before morgan
        new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
        new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' })
    ],
});

//Conditionally add Console transport for development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

//Morgan stream integration
export const winstonStream = {
    write: message => logger.info(message.trim())
}


export default logger;