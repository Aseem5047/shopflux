import { useEffect, useRef } from "react";
import { useNetworkStore } from "@/store/network.store";
import { OfflineScreen } from "../OfflineScreen";
import { toast } from "sonner";

export const NetworkGate = ({ children }: { children: React.ReactNode }) => {
	const { isOnline, isSlow } = useNetworkStore();
	const slowToastId = useRef<string | number | null>(null);

	useEffect(() => {
		if (isSlow) {
			if (!slowToastId.current) {
				slowToastId.current = toast.warning("Slow network detected", {
					description: "Requests may take longer than usual.",
					duration: Infinity,
				});
			}
		} else {
			if (slowToastId.current) {
				toast.dismiss(slowToastId.current);
				slowToastId.current = null;
			}
		}
	}, [isSlow]);

	if (!isOnline) return <OfflineScreen />;

	return <>{children}</>;
};
