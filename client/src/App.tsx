import { useSession } from "./features/auth/useSession";
import AppRoutes from "./routes";

export default function App() {
	useSession();
	return (
		<main className="h-screen overflow-auto">
			<AppRoutes />
		</main>
	);
}
