import { create } from "zustand";

type NetworkState = {
	isOnline: boolean;
	isSlow: boolean;
	setOnline: (v: boolean) => void;
	setSlow: (v: boolean) => void;
};

export const useNetworkStore = create<NetworkState>((set) => ({
	isOnline: navigator.onLine,
	isSlow: false,
	setOnline: (v) => set({ isOnline: v }),
	setSlow: (v) => set({ isSlow: v }),
}));
