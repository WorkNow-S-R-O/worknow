const REGION_ORDER = [
	['Центр страны', 'מרכז הארץ', 'Center'],
	['Юг страны', 'דרום הארץ', 'South'],
	['Север страны', 'צפון הארץ', 'North'],
];

export const sortCitiesWithRegionsFirst = (cities) => {
	const citiesArray = Array.isArray(cities) ? cities : [];
	const regions = REGION_ORDER
		.map((labels) =>
			citiesArray.find((city) => labels.includes(city.label || city.name)),
		)
		.filter(Boolean);
	const otherCities = citiesArray.filter((city) => !regions.includes(city));
	return { sortedCities: [...regions, ...otherCities], regions, otherCities };
};
