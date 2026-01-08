import { User } from "../../models/User.model";
import { AppError } from "../../utils/AppError";
import { hashPassword, comparePassword } from "../../utils/hash";

export const registerUser = async ({
	username,
	fullname,
	email,
	password,
}: {
	username: string;
	fullname: string;
	email: string;
	password: string;
}) => {
	const existingUser = await User.findOne({
		$or: [{ email }, { username }],
	});

	if (existingUser) {
		throw new AppError(409, "User already exists");
	}

	const passwordHash = await hashPassword(password);

	const user = await User.create({
		username,
		fullname,
		email,
		passwordHash,
	});

	return { user };
};

export const loginUser = async ({
	email,
	username,
	password,
}: {
	email?: string;
	username?: string;
	password: string;
}) => {
	const user = await User.findOne(email ? { email } : { username });

	if (!user) {
		throw new AppError(401, "User not found");
	}

	const isValid = await comparePassword(password, user.passwordHash);

	if (!isValid) {
		throw new AppError(401, "Invalid credentials");
	}

	return { user };
};

export const getUserProfile = async (userId: string) => {
	if (!userId) {
		throw new AppError(401, "Unauthorized");
	}
	const user = await User.findById(userId).select(
		"_id username fullname email role createdAt"
	);

	if (!user) {
		throw new AppError(404, "User not found");
	}

	return { user };
};
