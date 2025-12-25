import { Outlet, useLocation } from "react-router-dom";
import DirectionTransition from "../animations/DirectionTransition";

export default function AuthLayout() {
	const location = useLocation();
	const direction = location.pathname.includes("register") ? "left" : "right";

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center">
			<DirectionTransition direction={direction}>
				<Outlet />
			</DirectionTransition>
		</div>
	);
}
