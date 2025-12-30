import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
	const { isAuthenticated } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return children;
};
