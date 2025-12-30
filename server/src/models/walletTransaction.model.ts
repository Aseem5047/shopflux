import mongoose, { Schema, Types } from "mongoose";
import {
	WalletReferenceType,
	WalletTransactionType,
} from "../modules/wallet/wallet.types";

export interface WalletTransactionDocument {
	walletId: Types.ObjectId;
	type: WalletTransactionType;
	userId: Types.ObjectId;
	amount: number;
	referenceType: WalletReferenceType;
	referenceId: string;
	createdAt: Date;
}

const walletTransactionSchema = new Schema<WalletTransactionDocument>(
	{
		walletId: {
			type: Schema.Types.ObjectId,
			required: true,
			index: true,
		},
		type: {
			type: String,
			enum: ["CREDIT", "DEBIT", "REFUND", "ADJUSTMENT"],
			required: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			index: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		referenceType: {
			type: String,
			enum: [
				"ORDER",
				"REFUND",
				"WELCOME_BONUS",
				"ADMIN_ADJUSTMENT",
				"PAYOUT",
				"REVERSAL",
			],
			required: true,
		},
		referenceId: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

walletTransactionSchema.index(
	{ walletId: 1, type: 1, referenceType: 1, referenceId: 1 },
	{ unique: true }
);

export const WalletTransaction = mongoose.model(
	"WalletTransaction",
	walletTransactionSchema
);
