import crypto from "crypto";
import { Request, Response } from "express";
import { registerUser, loginUser, getUserProfile } from "./auth.actions";
import { redisClient } from "../../config/redis";
import {
	signAccessToken,
	signRefreshToken,
	verifyRefreshToken,
} from "../../utils/jwt";
import { AppError } from "../../utils/AppError";
import { create } from "domain";
import { publishUserRegistered } from "../../events/publishers/auth.publisher";

const ACCESS_COOKIE = {
	httpOnly: true,
	sameSite: "lax" as const,
	secure: process.env.NODE_ENV === "production",
	maxAge: 15 * 60 * 1000,
};

const REFRESH_COOKIE = {
	httpOnly: true,
	sameSite: "lax" as const,
	secure: process.env.NODE_ENV === "production",
	maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req: Request, res: Response) => {
	const { username, fullname, email, password } = req.body;

	const { user } = await registerUser({
		username,
		fullname,
		email,
		password,
	});

	await publishUserRegistered(user._id.toString());

	const tokenId = crypto.randomUUID();

	const accessToken = signAccessToken({
		userId: user._id.toString(),
		role: user.role,
	});

	const refreshToken = signRefreshToken({
		userId: user._id.toString(),
		tokenId,
	});

	await redisClient.set(`refresh:${tokenId}`, user._id.toString(), {
		EX: 60 * 60 * 24 * 7,
	});

	res
		.cookie("accessToken", accessToken, ACCESS_COOKIE)
		.cookie("refreshToken", refreshToken, REFRESH_COOKIE)
		.status(201)
		.json({
			id: user._id,
			username: user.username,
			email: user.email,
		});
};

export const login = async (req: Request, res: Response) => {
	const { user } = await loginUser(req.body);

	const tokenId = crypto.randomUUID();

	const accessToken = signAccessToken({
		userId: user._id.toString(),
		role: user.role,
	});

	const refreshToken = signRefreshToken({
		userId: user._id.toString(),
		tokenId,
	});

	await redisClient.set(`refresh:${tokenId}`, user._id.toString(), {
		EX: 60 * 60 * 24 * 7,
	});

	res
		.cookie("accessToken", accessToken, ACCESS_COOKIE)
		.cookie("refreshToken", refreshToken, REFRESH_COOKIE)
		.json({
			id: user._id,
			username: user.username,
			email: user.email,
		});
};

export const logout = async (req: Request, res: Response) => {
	const token = req.cookies.refreshToken;

	if (token) {
		const payload = verifyRefreshToken(token);
		await redisClient.del(`refresh:${payload.tokenId}`);
	}

	res
		.clearCookie("accessToken")
		.clearCookie("refreshToken")
		.json({ message: "Logged out" });
};

export const getProfile = async (req: Request, res: Response) => {
	const { userId } = req.user!;
	const cacheKey = `user:profile:${userId}`;

	// 1. Try Redis first
	const cachedUser = await redisClient.get(cacheKey);

	if (cachedUser) {
		return res.json(JSON.parse(cachedUser.toString()));
	}

	// 2. Fallback to DB
	const { user } = await getUserProfile(userId);

	const profile = {
		userId: user._id,
		username: user.username,
		fullname: user.fullname,
		email: user.email,
		role: user.role,
		createdAt: user.createdAt,
	};

	// 3. Store in Redis (TTL: 10 minutes)
	await redisClient.set(cacheKey, JSON.stringify(profile), {
		EX: 60 * 10,
	});

	res.json(profile);
};

export const refresh = async (req: Request, res: Response) => {
	const token = req.cookies.refreshToken;
	if (!token) {
		throw new AppError(401, "Refresh token missing");
	}

	let payload: { userId: string; tokenId: string };

	try {
		payload = verifyRefreshToken(token);
	} catch {
		throw new AppError(401, "Invalid refresh token");
	}

	try {
		const exists = await redisClient.get(`refresh:${payload.tokenId}`);

		if (!exists) {
			throw new AppError(401, "Session expired, please login again");
		}
	} catch (err) {
		if (err instanceof AppError) {
			throw err;
		}
		throw new AppError(401, "Please login again");
	}

	const newAccess = signAccessToken({
		userId: payload.userId,
		role: "USER",
	});

	res.cookie("accessToken", newAccess, ACCESS_COOKIE).sendStatus(200);
};
