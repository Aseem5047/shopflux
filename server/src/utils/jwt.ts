import jwt from "jsonwebtoken";
import { AuthPayload } from "../modules/auth/auth.types";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const signAccessToken = (payload: AuthPayload) =>
	jwt.sign({ ...payload, type: "access" }, ACCESS_SECRET, {
		expiresIn: "15m",
	});

export const signRefreshToken = (payload: {
	userId: string;
	tokenId: string;
}) =>
	jwt.sign({ ...payload, type: "refresh" }, REFRESH_SECRET, {
		expiresIn: "7d",
	});

export const verifyAccessToken = (token: string): AuthPayload =>
	jwt.verify(token, ACCESS_SECRET) as AuthPayload;

export const verifyRefreshToken = (token: string) =>
	jwt.verify(token, REFRESH_SECRET) as {
		userId: string;
		tokenId: string;
		type: "refresh";
	};
