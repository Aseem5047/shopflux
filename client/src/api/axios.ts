/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import { useNetworkStore } from "@/store/network.store";

let isRefreshing = false;

let pendingRequests: {
	resolve: () => void;
	reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any = null) => {
	pendingRequests.forEach(({ resolve, reject }) => {
		if (error) reject(error);
		else resolve();
	});
	pendingRequests = [];
};

const apiClient = axios.create({
	baseURL: "/api",
	withCredentials: true,
	timeout: 10000,
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */

apiClient.interceptors.request.use((config) => {
	(config as any).metadata = { startTime: new Date() };

	const slowTimer = setTimeout(() => {
		useNetworkStore.getState().setSlow(true);
	}, 2000);

	(config as any).slowTimer = slowTimer;
	return config;
});

/* ---------------- RESPONSE INTERCEPTOR ---------------- */

apiClient.interceptors.response.use(
	(res) => {
		const config = res.config as any;

		if (config?.slowTimer) clearTimeout(config.slowTimer);

		const timeTaken =
			new Date().getTime() - (config.metadata?.startTime?.getTime() || 0);

		useNetworkStore.getState().setSlow(timeTaken > 2000);
		return res;
	},
	async (err) => {
		const originalRequest = err.config as any;

		if (originalRequest?.slowTimer) {
			clearTimeout(originalRequest.slowTimer);
		}

		// Network error
		if (!err.response) {
			useNetworkStore.getState().setSlow(true);
			return Promise.reject(err);
		}

		// --------- 401 HANDLING ----------
		if (err.response.status === 401) {
			// If refresh itself fails → logout
			if (
				originalRequest._retry ||
				originalRequest.url?.includes("/auth/refresh")
			) {
				useAuthStore.getState().logout();
				return Promise.reject(err);
			}

			// If refresh already in progress → queue request
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					pendingRequests.push({ resolve: () => resolve(undefined), reject });
				}).then(() => apiClient(originalRequest));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				await apiClient.post("/auth/refresh");
				isRefreshing = false;
				processQueue();
				return apiClient(originalRequest);
			} catch (refreshError) {
				isRefreshing = false;
				processQueue(refreshError);
				useAuthStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(err);
	}
);

export default apiClient;
