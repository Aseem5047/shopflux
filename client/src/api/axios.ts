/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from "@/store/auth.store";
import { useNetworkStore } from "@/store/network.store";
import axios from "axios";

let isRefreshing = false;
let pendingRequests: any[] = [];

const processQueue = (error: any) => {
	pendingRequests.forEach((p) => p.reject(error));
	pendingRequests = [];
};

const apiClient = axios.create({
	baseURL: "/api",
	withCredentials: true,
	timeout: 10000, // 10s timeout for requests
});

// Request interceptor: track start time & setup slow timer
apiClient.interceptors.request.use((config) => {
	(config as any).metadata = { startTime: new Date() };

	// Show slow banner if request takes >2s
	const slowTimer = setTimeout(() => {
		useNetworkStore.getState().setSlow(true); // Set isSlow to true if request exceeds 2 seconds
	}, 2000);

	(config as any).slowTimer = slowTimer;

	return config;
});

// Response interceptor: handle success and errors
apiClient.interceptors.response.use(
	async (res) => {
		const config = res.config as any;
		const timeTaken =
			new Date().getTime() - (config.metadata?.startTime?.getTime() || 0);

		// Clear slow timer if it was set
		if (config?.slowTimer) {
			clearTimeout(config.slowTimer);
		}

		// Only reset the "slow" flag if the request was not slow (it finished in less than 2 seconds)
		if (timeTaken > 2000) {
			useNetworkStore.getState().setSlow(true); // Ensure slow is set to true if it took more than 2s
		} else {
			useNetworkStore.getState().setSlow(false); // Otherwise, set it to false
		}

		return res;
	},
	async (err) => {
		const originalRequest = err.config as any;

		// Clear slow timer if it was set
		if (originalRequest?.slowTimer) {
			clearTimeout(originalRequest.slowTimer);
		}

		// Handle network issues or other errors
		if (!err.response) {
			useNetworkStore.getState().setSlow(true);
			return Promise.reject(err);
		}

		// Handle authentication issues (401)
		if (err.response.status === 401) {
			// Handle token refresh logic (already implemented)
			if (
				originalRequest.url?.includes("/auth/refresh") ||
				originalRequest._retry
			) {
				useAuthStore.getState().logout();
				return Promise.reject(err);
			}

			if (isRefreshing) {
				return new Promise((_, reject) => {
					pendingRequests.push({ reject });
				});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				await apiClient.post("/auth/refresh");
				isRefreshing = false;
				return apiClient(originalRequest);
			} catch (e) {
				isRefreshing = false;
				processQueue(e);
				useAuthStore.getState().logout();
				return Promise.reject(e);
			}
		}

		// For any other errors, reject
		return Promise.reject(err);
	}
);

export default apiClient;
