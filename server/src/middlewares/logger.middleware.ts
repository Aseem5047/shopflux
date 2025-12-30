import morgan from "morgan";
import { logger } from "../utils/Logger";
import { Request, Response } from "express";
import { TokenIndexer } from "morgan";

interface MorganTokens {
	tokens: TokenIndexer;
	req: Request;
	res: Response;
}

interface MorganStream {
	write: (message: string) => void;
}

export const requestLogger = morgan(
	(
		tokens: MorganTokens["tokens"],
		req: MorganTokens["req"],
		res: MorganTokens["res"]
	) => {
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			`${tokens["response-time"](req, res)} ms`,
			"-",
			req.ip,
			"-",
			tokens["user-agent"](req, res),
		].join(" ");
	},
	{
		stream: {
			write: (message: string) => logger.info(message.trim()),
		} as MorganStream,
	}
);
