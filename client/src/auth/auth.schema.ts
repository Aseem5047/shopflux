import { z } from "zod";

const emailSchema = z.string().email();
const usernameSchema = z
	.string()
	.min(2)
	.regex(/^[a-zA-Z0-9_]+$/, "Invalid username");

export const loginSchema = z.object({
	identifier: z
		.string()
		.min(1, "Email or username is required")
		.refine((val) => {
			return (
				emailSchema.safeParse(val).success ||
				usernameSchema.safeParse(val).success
			);
		}, "Must be a valid email or username"),
	password: z.string().min(6),
});

export const registerSchema = z.object({
	username: usernameSchema,
	email: emailSchema,
	password: z.string().min(6),
});
