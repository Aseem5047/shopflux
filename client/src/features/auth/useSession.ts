import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "./auth.api";
import { useAuthStore } from "@/store/auth.store";
import type { AuthUser } from "@/types";

export const useSession = () => {
	const setUser = useAuthStore((s) => s.setUser);
	const logout = useAuthStore((s) => s.logout);

	const query = useQuery<AuthUser>({
		queryKey: ["me"],
		queryFn: getMe,
	});

	useEffect(() => {
		if (query.data) {
			setUser(query.data);
		}
	}, [query.data, setUser]);

	useEffect(() => {
		if (query.isError) {
			logout();
		}
	}, [query.isError, logout]);

	return query;
};
