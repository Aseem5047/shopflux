import { AppError } from "../utils/AppError";
import { Request, Response, NextFunction } from "express";

interface InternalAuthRequest extends Request {
	headers: {
		"x-internal-key"?: string;
	} & Request["headers"];
}

export const requireInternalAuth = (
	req: InternalAuthRequest,
	res: Response,
	next: NextFunction
): void => {
	if (req.headers["x-internal-key"] !== process.env.INTERNAL_API_KEY) {
		throw new AppError(403, "Forbidden");
	}
	next();
};
