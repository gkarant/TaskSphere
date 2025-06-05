import mongoose from "mongoose";
import logger from "../utils/logger.js";
//console.log(process.env.MONGO_URI);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        //console.log("DB connected successfully");
        logger.info('MongoDB connected successfully')
    } catch (err) {
        // console.error(err.message);
        logger.error('MongoDB connection Failed', err)
        process.exit(1);
    }
}

export { connectDB, mongoose };