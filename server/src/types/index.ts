import { Document } from "mongoose";

export interface IUser extends Document {
	username: string;
	fullname: string;
	email: string;
	passwordHash: string;
	role: "USER" | "ADMIN";
	createdAt: Date;
	updatedAt: Date;
}
