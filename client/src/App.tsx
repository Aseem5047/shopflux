import { useSession } from "./features/auth/useSession";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import AppRoutes from "./routes";

export default function App() {
	useSession();
	useNetworkStatus();

	return (
		<main className="h-screen overflow-auto">
			<AppRoutes />
		</main>
	);
}
