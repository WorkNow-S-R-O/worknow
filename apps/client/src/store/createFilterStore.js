import { create } from 'zustand';

export const createFilterStore = (initialFilters) =>
	create((set) => ({
		filters: { ...initialFilters },
		setFilters: (newFilters) => set({ filters: newFilters }),
		resetFilters: () => set({ filters: { ...initialFilters } }),
	}));
