import { createFilterStore } from './createFilterStore';

const useSeekerFilterStore = createFilterStore({
	city: undefined,
	category: undefined,
	employment: undefined,
	documentType: undefined,
	languages: undefined,
	gender: undefined,
	isDemanded: undefined,
});

export default useSeekerFilterStore;
