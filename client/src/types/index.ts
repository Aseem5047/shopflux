import { z } from "zod";
import { loginSchema, registerSchema } from "../lib/auth.schema";

// User Types

export type AuthUser = {
	id: string;
	username: string;
	fullname: string;
	email: string;
};

// Product Types

export interface Product {
	id: string;
	title: string;
	price: number;
	rating: number;
	specification: string[];
	detail: string;
	image: string[];
	type: string;
}

// Zod Types

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;