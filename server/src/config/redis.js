import { createClient } from 'redis';
const redisClient = createClient();
redisClient.on('error', err => console.error('Redisr Error:', err));
const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.warn("Redis connection failed:", err.message);
    }

}
if (process.env.REDIS_ENABLED === 'true') {
    connectRedis();
}

export default redisClient;
