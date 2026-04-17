import { z } from "zod";

/* =========================
   SHARED FIELD SCHEMAS
========================= */

export const emailSchema = z
	.string()
	.nonempty("Email is required")
	.email("Invalid email format");

export const usernameSchema = z
	.string()
	.nonempty("Username is required")
	.min(3, "Username must have at least 3 characters")
	.regex(
		/^[a-zA-Z0-9_]+$/,
		"Username can only contain letters, numbers, and underscores"
	);

export const fullnameSchema = z
	.string()
	.nonempty("Fullname is required")
	.min(3, "Fullname must have at least 3 characters");

export const passwordSchema = z
	.string()
	.nonempty("Password is required")
	.regex(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
		"Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
	);

export const loginSchema = z.object({
	identifier: z
		.string()
		.nonempty("Email or username is required")
		.refine(
			(val) =>
				emailSchema.safeParse(val).success ||
				usernameSchema.safeParse(val).success,
			{
				message: "Must be a valid email or username",
			}
		),
	password: z.string().nonempty("Password is required"),
});

export const registerSchema = z
	.object({
		username: usernameSchema,
		fullname: fullnameSchema,
		email: emailSchema,
		password: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});
