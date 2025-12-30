import { Wallet } from "../../models/wallet.model";
import { AppError } from "../../utils/AppError";
import { WalletTransaction } from "../../models/walletTransaction.model";
import mongoose, { Types } from "mongoose";

export const getWalletByUserId = async (userId: string) => {
	const wallet = await Wallet.findOne({ userId });

	if (!wallet) {
		throw new AppError(404, "Wallet not found");
	}

	return wallet;
};

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
	const session = await mongoose.startSession();

	try {
		session.startTransaction();

		const wallet = await Wallet.findOne({ userId }).session(session);

		if (!wallet) throw new AppError(404, "Wallet not found");

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

		wallet.balance += amount;
		await wallet.save({ session });

		await session.commitTransaction();

		return wallet;
	} catch (err) {
		await session.abortTransaction();
		if (err.code === 11000) {
			throw new AppError(409, "Duplicate transaction");
		}
		throw err;
	} finally {
		session.endSession();
	}
};

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
	const session = await mongoose.startSession();

	try {
		session.startTransaction();

		const wallet = await Wallet.findOne({ userId }).session(session);
		if (!wallet) throw new AppError(404, "Wallet not found");

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

		const updatedWallet = await Wallet.findOneAndUpdate(
			{ _id: wallet._id, balance: { $gte: amount } },
			{ $inc: { balance: -amount } },
			{ session, new: true }
		);

		if (!updatedWallet) {
			throw new AppError(400, "Insufficient balance");
		}

		await session.commitTransaction();
		return updatedWallet;
	} catch (err: any) {
		await session.abortTransaction();

		if (err.code === 11000) {
			throw new AppError(409, "Duplicate transaction");
		}

		throw err;
	} finally {
		session.endSession();
	}
};
