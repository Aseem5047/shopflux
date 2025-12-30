/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNetworkStore } from "@/store/network.store";

export const useNetworkStatus = () => {
	const { setOnline, setSlow } = useNetworkStore();

	useEffect(() => {
		const onOnline = () => setOnline(true);
		const onOffline = () => setOnline(false);

		window.addEventListener("online", onOnline);
		window.addEventListener("offline", onOffline);

		// Detect slow network using navigator.connection
		const connection = (navigator as any).connection;
		const updateConnection = () => {
			if (connection) {
				// effectiveType can be 'slow-2g', '2g', '3g', '4g'
				setSlow(
					connection.effectiveType === "3g" ||
						connection.effectiveType === "slow-3g"
				);
			}
		};

		if (connection) {
			connection.addEventListener("change", updateConnection);
			updateConnection();
		}

		return () => {
			window.removeEventListener("online", onOnline);
			window.removeEventListener("offline", onOffline);
			if (connection)
				connection.removeEventListener("change", updateConnection);
		};
	}, [setOnline, setSlow]);
};
