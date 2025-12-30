import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import walletRoutes from "./modules/wallet/wallet.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { requestLogger } from "./middlewares/logger.middleware";

const app = express();

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

// health check
app.get("/api/health", (_req, res) => {
	res.json({ status: "ok", service: "ShopFlux Backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);

app.use(errorHandler);

export default app;
