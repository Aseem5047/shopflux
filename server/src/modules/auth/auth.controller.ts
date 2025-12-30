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
	const { user } = await getUserProfile(userId);

	res.json({
		userId: user._id,
		username: user.username,
		fullname: user.fullname,
		email: user.email,
		role: user.role,
		createdAt: user.createdAt,
	});
};

export const refresh = async (req: Request, res: Response) => {
	const token = req.cookies.refreshToken;
	if (!token) throw new AppError(401, "Token missing");

	const payload = verifyRefreshToken(token);

	try {
		const exists = await redisClient.get(payload.tokenId);
		if (!exists) throw new AppError(401, "Session expired");
	} catch (err) {
		// Redis unavailable → force re-login
		throw new AppError(401, "Please login again");
	}

	await redisClient.del(`refresh:${payload.tokenId}`);

	const newTokenId = crypto.randomUUID();

	const newAccess = signAccessToken({
		userId: payload.userId,
		role: "USER",
	});

	const newRefresh = signRefreshToken({
		userId: payload.userId,
		tokenId: newTokenId,
	});

	await redisClient.set(`refresh:${newTokenId}`, payload.userId, {
		EX: 60 * 60 * 24 * 7,
	});

	res
		.cookie("accessToken", newAccess, ACCESS_COOKIE)
		.cookie("refreshToken", newRefresh, REFRESH_COOKIE)
		.sendStatus(200);
};
