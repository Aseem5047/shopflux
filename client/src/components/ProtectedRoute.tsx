import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
	const { isAuthenticated } = useAuthStore();
	const location = useLocation();

	if (!isAuthenticated && location.pathname !== "/") {
		return <Navigate to="/login" replace />;
	}

	return children;
};
