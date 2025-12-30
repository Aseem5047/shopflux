import { Request, Response } from "express";
import { creditWallet, debitWallet, getWalletByUserId } from "./wallet.actions";

export const getMyWallet = async (req: Request, res: Response) => {
	const userId = req.user!.userId;

	const wallet = await getWalletByUserId(userId);

	res.json({
		balance: wallet.balance,
		currency: wallet.currency,
	});
};

export const creditUserWallet = async (req: Request, res: Response) => {
	const { userId, amount, referenceId, referenceType } = req.body;

	const wallet = await creditWallet({
		userId,
		amount,
		referenceId,
		referenceType,
	});

	res.json({
		userId: wallet.userId,
		balance: wallet.balance,
	});
};

export const debitUserWallet = async (req: Request, res: Response) => {
	const { userId, amount, referenceId, referenceType } = req.body;

	const wallet = await debitWallet({
		userId,
		amount,
		referenceId,
		referenceType,
	});

	res.json({
		userId: wallet.userId,
		balance: wallet.balance,
	});
};
