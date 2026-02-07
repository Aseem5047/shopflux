import mongoose from "mongoose";
import { Wallet } from "../../models/wallet.model";
import { WalletTransaction } from "../../models/walletTransaction.model";
import { AppError } from "../../utils/AppError";

/**
 * Get wallet by userId
 */
export const getWalletByUserId = async (userId: string) => {
	const wallet = await Wallet.findOne({ userId });

	if (!wallet) {
		throw new AppError(404, "Wallet not found");
	}

	return wallet;
};

/**
 * Credit wallet
 */
export const creditWallet = async ({
	userId,
	amount,
	referenceId,
	referenceType,
	type = "CREDIT",
}: {
	userId: string;
	amount: number;
	referenceId: string;
	referenceType: string;
	type?: "CREDIT" | "REFUND" | "ADJUSTMENT";
}) => {
	if (amount <= 0) {
		throw new AppError(400, "Amount must be greater than zero");
	}

	if (!referenceId || !referenceType) {
		throw new AppError(400, "Invalid transaction reference");
	}

	const session = await mongoose.startSession();

	try {
		let updatedWallet: any;

		await session.withTransaction(async () => {
			const wallet = await Wallet.findOne({ userId }).session(session);
			if (!wallet) {
				throw new AppError(404, "Wallet not found");
			}

			updatedWallet = await Wallet.findOneAndUpdate(
				{ _id: wallet._id },
				{ $inc: { balance: amount } },
				{ session, new: true }
			);

			await WalletTransaction.create(
				[
					{
						walletId: wallet._id,
						userId,
						amount,
						type,
						referenceId,
						referenceType,
					},
				],
				{ session }
			);
		});

		return updatedWallet;
	} catch (err: any) {
		if (err.code === 11000) {
			throw new AppError(409, "Duplicate transaction");
		}
		throw err;
	} finally {
		session.endSession();
	}
};

/**
 * Debit wallet
 */
export const debitWallet = async ({
	userId,
	amount,
	referenceId,
	referenceType,
	type = "DEBIT",
}: {
	userId: string;
	amount: number;
	referenceId: string;
	referenceType: string;
	type?: "DEBIT" | "ADJUSTMENT";
}) => {
	if (amount <= 0) {
		throw new AppError(400, "Amount must be greater than zero");
	}

	if (!referenceId || !referenceType) {
		throw new AppError(400, "Invalid transaction reference");
	}

	const session = await mongoose.startSession();

	try {
		let updatedWallet: any;

		await session.withTransaction(async () => {
			const wallet = await Wallet.findOne({ userId }).session(session);
			if (!wallet) {
				throw new AppError(404, "Wallet not found");
			}

			updatedWallet = await Wallet.findOneAndUpdate(
				{
					_id: wallet._id,
					balance: { $gte: amount },
				},
				{ $inc: { balance: -amount } },
				{ session, new: true }
			);

			if (!updatedWallet) {
				throw new AppError(400, "Insufficient balance");
			}

			await WalletTransaction.create(
				[
					{
						walletId: wallet._id,
						userId,
						amount,
						type,
						referenceId,
						referenceType,
					},
				],
				{ session }
			);
		});

		return updatedWallet;
	} catch (err: any) {
		if (err.code === 11000) {
			throw new AppError(409, "Duplicate transaction");
		}
		throw err;
	} finally {
		session.endSession();
	}
};
