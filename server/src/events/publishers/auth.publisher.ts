import { redisClient } from "../../config/redis";

export const publishUserRegistered = async (userId: string) => {
	await redisClient.xAdd("auth:events", "*", {
		type: "USER_REGISTERED",
		userId,
	});
};
