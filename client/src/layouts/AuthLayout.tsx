import { Outlet, useLocation } from "react-router-dom";

export default function AuthLayout() {
	const location = useLocation();

	const direction = location.pathname.includes("register") ? "left" : "right";

	return (
		<div
			className={`min-h-screen w-full bg-gray-100 flex items-center justify-center ${
				direction === "left" ? "slideInLeft" : "slideInRight"
			}`}
		>
			<Outlet />
		</div>
	);
}
