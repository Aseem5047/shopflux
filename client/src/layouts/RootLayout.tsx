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
				<div className="flex flex-col h-dvh w-full overflow-hidden">
					<Navbar />
					<ProtectedRoute>
						<main className="flex-1 overflow-y-auto">
							<Outlet />
							<Footer />
						</main>
					</ProtectedRoute>
				</div>
			</NetworkGate>
		</SessionGate>
	);
}
