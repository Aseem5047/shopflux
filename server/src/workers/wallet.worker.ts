import { redisClient } from "../config/redis";
import { Wallet } from "../models/wallet.model";
import { WalletTransaction } from "../models/walletTransaction.model";
import mongoose from "mongoose";

const STREAM = "auth:events";
const GROUP = "wallet-group";
const CONSUMER = "wallet-consumer-1";

export const startWalletWorker = async () => {
	try {
		await redisClient.xGroupCreate(STREAM, GROUP, "0", { MKSTREAM: true });
	} catch {}

	while (true) {
		try {
			const data = await redisClient.xReadGroup(
				GROUP,
				CONSUMER,
				[{ key: STREAM, id: ">" }],
				{ COUNT: 1, BLOCK: 5000 }
			);

			if (!data) continue;

			for (const stream of data as any) {
				for (const message of stream.messages) {
					const { type, userId } = message.message;

					if (type === "USER_REGISTERED") {
						await handleUserRegistered(userId);
					}

					await redisClient.xAck(STREAM, GROUP, message.id);
				}
			}
		} catch (err) {
			console.error("Wallet worker error", err);
			await new Promise((r) => setTimeout(r, 2000));
		}
	}
};

const handleUserRegistered = async (userId: string) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const existing = await Wallet.findOne({ userId }).session(session);

		if (existing) return;

		const wallet = await Wallet.create([{ userId }], { session });

		await WalletTransaction.create(
			[
				{
					walletId: wallet[0]._id,
					type: "CREDIT",
					userId: userId,
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
};
