import apiClient from "@/api/axios";

export const login = async (data: {
	email?: string;
	username?: string;
	password: string;
}) => {
	const res = await apiClient.post("/auth/login", data);
	return res.data;
};

export const register = async (data: {
	username: string;
	email: string;
	password: string;
}) => {
	const res = await apiClient.post("/auth/register", data);
	return res.data;
};

export const logout = async () => {
	await apiClient.post("/auth/logout");
};

export const getMe = async () => {
	const res = await apiClient.get("/auth/me");
	return res.data;
};
