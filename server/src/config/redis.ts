import { createClient } from "redis";

export const redisClient = createClient({
	url: process.env.REDIS_URL,
});

export async function connectRedis() {
	redisClient.on("error", (err) => {
		console.error("Redis error", err);
	});

	await redisClient.connect();
	console.log("Redis connected");
}
