import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/Logger";

export const errorHandler = (
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	// Known application errors
	if (err instanceof AppError) {
		logger.warn(err.message);

		return res.status(err.statusCode).json({
			message: err.message,
		});
	}

	// Unknown / system errors
	const message = err instanceof Error ? err.message : "Unknown error occurred";

	logger.error(message, {
		err,
	});

	return res.status(500).json({
		message: "Internal server error",
	});
};
