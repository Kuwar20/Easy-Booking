import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL
});

// repeatedly trying to reconnect to redis
// redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
    // Handle the failure after the first attempt
    console.log('Failed to connect to Redis on first attempt. Exiting...');
    process.exit(1); // Exit the process if unable to connect
});

// to run this application without redis in local just to test the application
async function connectToRedis() {
    try {
        await redisClient.connect();
        console.log('Successfully connected to Redis');
    } catch (err) {
        console.log('Redis Connection Error', err);
        process.exit(1);
    }
}

connectToRedis();


export default redisClient;