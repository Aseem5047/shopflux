import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { NextFunction, Request, Response } from "express";

export const requireAuth = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies?.accessToken;

	if (!token) throw new AppError(401, "Unauthorized");

	try {
		req.user = verifyAccessToken(token);
		next();
	} catch {
		throw new AppError(401, "Token expired");
	}
};
