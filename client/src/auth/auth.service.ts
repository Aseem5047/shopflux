import apiClient from "@/api/axios";
import type { LoginData, RegisterData } from "./auth.types";

export const login = (data: LoginData) =>
	apiClient.post("/api/auth/login", data, { withCredentials: true });

export const register = (data: RegisterData) =>
	apiClient.post("/api/auth/register", data, { withCredentials: true });
