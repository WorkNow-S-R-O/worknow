import { create } from 'zustand';

const useSeekerFilterStore = create((set) => ({
	filters: {
		city: undefined,
		category: undefined,
		employment: undefined,
		documentType: undefined,
		languages: undefined,
		gender: undefined,
		isDemanded: undefined,
	},
	setFilters: (newFilters) => set({ filters: newFilters }),
	resetFilters: () =>
		set({
			filters: {
				city: undefined,
				category: undefined,
				employment: undefined,
				documentType: undefined,
				languages: undefined,
				gender: undefined,
				isDemanded: undefined,
			},
		}),
}));

export default useSeekerFilterStore;
