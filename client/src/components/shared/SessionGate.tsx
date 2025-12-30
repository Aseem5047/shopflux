import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import SplashScreen from "@/components/shared/SplashScreen";

const MIN_SPLASH_TIME = 400;

export const SessionGate = ({ children }: { children: React.ReactNode }) => {
	const { initialized } = useAuthStore();
	const [showSplash, setShowSplash] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowSplash(false);
		}, MIN_SPLASH_TIME);

		return () => clearTimeout(timer);
	}, []);

	if (!initialized || showSplash) {
		return <SplashScreen />;
	}

	return <>{children}</>;
};
