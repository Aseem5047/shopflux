import type { AuthUser } from "@/types";
import { create } from "zustand";

type AuthState = {
	user: AuthUser | null;
	isAuthenticated: boolean;
	initialized: boolean;
	setUser: (user: AuthUser | null) => void;
	logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isAuthenticated: false,
	initialized: false,
	setUser: (user) =>
		set({
			user,
			isAuthenticated: !!user,
			initialized: true,
		}),

	logout: () =>
		set((state) => {
			if (!state.isAuthenticated && state.initialized) {
				return state;
			}

			return {
				user: null,
				isAuthenticated: false,
				isInitialized: true,
			};
		}),
}));
