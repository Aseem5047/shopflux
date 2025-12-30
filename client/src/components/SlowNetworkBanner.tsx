import { useEffect, useState } from "react";

export const SlowNetworkBanner = () => {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setVisible(false), 7000);
		return () => clearTimeout(timer);
	}, []);

	if (!visible) return null;

	return (
		<div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 z-50 shadow-md">
			⚠️ Your network is slow. Some features may take longer to load.
		</div>
	);
};
