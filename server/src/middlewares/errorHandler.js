
import logger from "../utils/logger.js";
const errorHandler = (err, req, res, next) => {
    //console.error(err.stack) //this will be replaced by winston
    logger.error(`${err.statusCode || 500}-${err.message}-${req.originalUrl}-${req.method}-${req.ip}`); //winston

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default errorHandler;