import { useEffect } from "react";
import { getMe } from "./auth.api";
import { useAuthStore } from "@/store/auth.store";

export const useSession = () => {
	const { setUser, logout } = useAuthStore();

	useEffect(() => {
		let cancelled = false;

		const initSession = async () => {
			try {
				const user = await getMe();
				if (!cancelled) setUser(user);
			} catch (err) {
				if (cancelled) return;
				console.log("Session initialization failed:", err);

				const { isAuthenticated } = useAuthStore.getState();

				if (isAuthenticated) {
					logout();
				} else {
					useAuthStore.setState({ initialized: true });
				}
			}
		};

		initSession();

		return () => {
			cancelled = true;
		};
	}, [setUser, logout]);
};
