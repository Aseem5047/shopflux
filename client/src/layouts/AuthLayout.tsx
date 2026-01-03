import { useAuthStore } from "@/store/auth.store";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { NetworkGate } from "@/components/shared/NetworkGate";
import { SessionGate } from "@/components/shared/SessionGate";

export default function AuthLayout() {
	const { isAuthenticated, initialized } = useAuthStore();
	const navigate = useNavigate();
	const location = useLocation();
	const authToastId = useRef<string | number | null>(null);

	const direction = location.pathname.includes("register") ? "left" : "right";

	useEffect(() => {
		if (isAuthenticated && initialized) {
			navigate("/", { replace: true });

			if (!authToastId.current) {
				authToastId.current = toast.info("You are already logged in.");
			}
		} else {
			if (authToastId.current) {
				toast.dismiss(authToastId.current);
				authToastId.current = null;
			}
		}
	}, [initialized, isAuthenticated, navigate]);

	if (isAuthenticated) return null;

	return (
		<SessionGate>
			<div
				className={`min-h-screen w-full bg-gray-100 flex items-center justify-center ${
					direction === "left" ? "slideInLeft" : "slideInRight"
				}`}
			>
				<NetworkGate>
					<Outlet />
				</NetworkGate>
			</div>
		</SessionGate>
	);
}
