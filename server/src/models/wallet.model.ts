import mongoose, { Schema, Types } from "mongoose";

export interface WalletDocument {
	userId: Types.ObjectId;
	createdAt: Date;
}

const walletSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			unique: true,
		},
		balance: {
			type: Number,
			default: 0,
			min: 0,
		},
		currency: {
			type: String,
			default: "INR",
		},
		locked: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export const Wallet = mongoose.model("Wallet", walletSchema);
