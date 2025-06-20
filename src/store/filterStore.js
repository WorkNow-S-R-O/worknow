import { create } from "zustand";

const useFilterStore = create((set) => ({
  filters: {
    salary: undefined,
    categoryId: undefined,
  },
  setFilters: (newFilters) => set({ filters: newFilters }),
  resetFilters: () => set({ filters: { salary: undefined, categoryId: undefined } }),
}));

export default useFilterStore; 