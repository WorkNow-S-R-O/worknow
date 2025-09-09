import { create } from 'zustand';

const useFilterStore = create((set) => ({
	filters: {
		salary: undefined,
		categoryId: undefined,
		shuttleOnly: false,
		mealsOnly: false,
	},
	setFilters: (newFilters) => set({ filters: newFilters }),
	resetFilters: () =>
		set({
			filters: {
				salary: undefined,
				categoryId: undefined,
				shuttleOnly: false,
				mealsOnly: false,
			},
		}),
}));

export default useFilterStore;
