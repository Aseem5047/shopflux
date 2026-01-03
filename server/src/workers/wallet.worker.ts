import { redisClient } from "../config/redis";
import mongoose from "mongoose";
import { Wallet } from "../models/wallet.model";
import { WalletTransaction } from "../models/walletTransaction.model";

/* -------------------- STREAMS -------------------- */
const AUTH_STREAM = "auth:events";
// const ORDER_STREAM = "order:events";

/* -------------------- GROUPS -------------------- */
const WALLET_AUTH_GROUP = "wallet-auth-group";
// const WALLET_ORDER_GROUP = "wallet-order-group";

/* -------------------- CONSUMER -------------------- */

const CONSUMER = "wallet-consumer-1";

/* -------------------- EVENT HANDLERS -------------------- */

const eventHandlers: Record<string, Function> = {
	USER_REGISTERED: handleUserRegistered,
	// future events can be added here:
	// ORDER_PLACED: handleWalletDebit,
	// ORDER_REFUNDED: handleWalletCredit,
};

/* =================================================
   WORKER BOOTSTRAP
================================================= */

export const startWalletWorker = async () => {
	await createGroupIfNotExists(AUTH_STREAM, WALLET_AUTH_GROUP);
	console.log("💳 Wallet worker started");

	consumeStream(AUTH_STREAM, WALLET_AUTH_GROUP, CONSUMER);

	// await createGroupIfNotExists(ORDER_STREAM, WALLET_ORDER_GROUP);

	// await Promise.all([consumeStream(AUTH_STREAM, WALLET_AUTH_GROUP, CONSUMER), consumeStream(ORDER_STREAM, WALLET_ORDER_GROUP, CONSUMER)]);
};

/* =================================================
   REDIS HELPERS
================================================= */

const createGroupIfNotExists = async (stream: string, group: string) => {
	try {
		await redisClient.xGroupCreate(stream, group, "0", { MKSTREAM: true });
	} catch {
		// group already exists
	}
};

const consumeStream = async (
	stream: string,
	group: string,
	consumer: string
) => {
	while (true) {
		try {
			const data = await redisClient.xReadGroup(
				group,
				consumer,
				[{ key: stream, id: ">" }],
				{ COUNT: 5, BLOCK: 5000 }
			);

			if (!data) continue;

			for (const s of data as any) {
				for (const message of s.messages) {
					await handleMessage(stream, group, message);
				}
			}
		} catch (err) {
			console.error("Wallet worker error:", err);
			await delay(2000);
		}
	}
};

const handleMessage = async (stream: string, group: string, message: any) => {
	const { type } = message.message;

	const handler = eventHandlers[type];
	if (handler) {
		try {
			await handler(message.message);
		} catch (err) {
			console.error(`Error handling event ${type}:`, err);
		}
	} else {
		console.warn(`No handler for event type: ${type}`);
	}

	await redisClient.xAck(stream, group, message.id);
};

/* =================================================
   EVENT HANDLERS
================================================= */

async function handleUserRegistered(payload: { userId: string }) {
	const { userId } = payload;
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const existing = await Wallet.findOne({ userId }).session(session);
		if (existing) return;

		const [wallet] = await Wallet.create([{ userId, balance: 100 }], {
			session,
		});

		await WalletTransaction.create(
			[
				{
					walletId: wallet._id,
					type: "CREDIT",
					userId,
					amount: 100,
					referenceType: "WELCOME_BONUS",
					referenceId: userId,
				},
			],
			{ session }
		);

		await session.commitTransaction();
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		session.endSession();
	}
}

/* =================================================
   UTILS
================================================= */

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
