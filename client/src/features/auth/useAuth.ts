import { useMutation } from "@tanstack/react-query";
import { login, register, logout } from "./auth.api";
import { useAuthStore } from "@/store/auth.store";

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
