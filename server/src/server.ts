import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectMongo } from "./config/mongo";
import { connectRedis } from "./config/redis";
import { startWalletWorker } from "./workers/wallet.worker";

const PORT = process.env.PORT || 5000;

async function startServer() {
	await connectMongo();
	await connectRedis();

	app.listen(PORT, () => {
		console.log(`ShopFlux backend running on port ${PORT}`);
	});
}

startWalletWorker();
startServer();
