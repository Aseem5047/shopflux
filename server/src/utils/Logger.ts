import winston from "winston";

const isProd = process.env.NODE_ENV === "production";

// Pretty format for development
const devFormat = winston.format.printf(
	({ level, message, timestamp, ...meta }) => {
		return `${timestamp} | ${level.toUpperCase()} | ${message} ${
			Object.keys(meta).length ? JSON.stringify(meta) : ""
		}`;
	}
);

export const logger = winston.createLogger({
	level: isProd ? "info" : "debug",
	format: winston.format.combine(
		winston.format.timestamp(
			isProd ? undefined : { format: "DD MMM YYYY, hh:mm:ss A" }
		),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		isProd ? winston.format.json() : devFormat
	),
	transports: [new winston.transports.Console()],
});
