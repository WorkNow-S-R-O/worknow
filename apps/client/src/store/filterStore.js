import { createFilterStore } from './createFilterStore';

const useFilterStore = createFilterStore({
	salary: undefined,
	categoryId: undefined,
	shuttleOnly: false,
	mealsOnly: false,
});

export default useFilterStore;
