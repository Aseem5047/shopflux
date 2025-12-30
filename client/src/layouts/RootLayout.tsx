import { ProtectedRoute } from "@/components/ProtectedRoute";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { Outlet } from "react-router-dom";
import { SessionGate } from "../components/shared/SessionGate";
import { NetworkGate } from "@/components/shared/NetworkGate";

export default function RootLayout() {
	return (
		<SessionGate>
			<NetworkGate>
				<Navbar />
				<ProtectedRoute>
					<Outlet />
				</ProtectedRoute>
				<Footer />
			</NetworkGate>
		</SessionGate>
	);
}
