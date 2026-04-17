import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { login, logout, register } from "./auth.api";

export const useLogin = () => {
	const setUser = useAuthStore((s) => s.setUser);

	return useMutation({
		mutationFn: login,
		onSuccess: (user) => {
			setUser(user);
		},
	});
};

export const useRegister = () => {
	const setUser = useAuthStore((s) => s.setUser);

	return useMutation({
		mutationFn: register,
		onSuccess: (user) => {
			setUser(user);
		},
	});
};

export const useLogout = () => {
	const logoutStore = useAuthStore((s) => s.logout);

	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			logoutStore();
		},
	});
};
