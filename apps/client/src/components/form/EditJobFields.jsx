import PropTypes from 'prop-types';
import Select from 'react-select';
import Skeleton from 'react-loading-skeleton';
import { useIntlayer } from 'react-intlayer';
import ImageUpload from '../ui/ImageUpload';

const EditJobFields = ({
	register,
	errors,
	setValue,
	selectedCityId,
	selectedCategoryId,
	cities,
	categories,
	loadingCities,
	loadingCategories,
	loadingJob,
	onImageUpload,
	currentImageUrl,
}) => {
	const content = useIntlayer('editJobFields');

	// Сортировка: регионы в начале, остальные города после
	const regionOrder = [
		['Центр страны', 'מרכז הארץ', 'Center'],
		['Юг страны', 'דרום הארץ', 'South'],
		['Север страны', 'צפון הארץ', 'North'],
	];
	const regions = regionOrder
		.map((labels) =>
			cities.find((city) => labels.includes(city.label || city.name)),
		)
		.filter(Boolean);
	const otherCities = cities.filter((city) => !regions.includes(city));
	const sortedCities = [...regions, ...otherCities];

	return (
		<>
			{/* Название вакансии */}
			<div className="mb-4">
				<label className="block text-gray-700 mb-2">
					{content.jobTitle.value}
				</label>
				{loadingJob ? (
					<Skeleton height={45} className="mb-3" />
				) : (
					<input
						type="text"
						{...register('title')}
						className={`bg-white w-full border px-3 py-2 rounded ${
							errors.title ? 'border-red-500' : 'border-gray-300'
						}`}
					/>
				)}
				{errors.title && (
					<p className="text-red-500 text-sm">{errors.title.message}</p>
				)}
			</div>

			{/* Зарплата в час */}
			<div className="mb-4">
				<label className="block text-gray-700 mb-2">
					{content.salaryPerHour.value}
				</label>
				{loadingJob ? (
					<Skeleton height={45} className="mb-3" />
				) : (
					<input
						type="text"
						{...register('salary')}
						className={`bg-white w-full border px-3 py-2 rounded ${
							errors.salary ? 'border-red-500' : 'border-gray-300'
						}`}
					/>
				)}
				{errors.salary && (
					<p className="text-red-500 text-sm">{errors.salary.message}</p>
				)}
			</div>

			{/* Город */}
			<div className="mb-4">
				<label className="block text-gray-700 mb-2">
					{content.location.value}
				</label>
				{loadingCities ? (
					<Skeleton height={40} />
				) : (
					<Select
						options={sortedCities}
						value={
							sortedCities.find((city) => city.value == selectedCityId) || null
						}
						onChange={(option) => setValue('cityId', option?.value)}
						placeholder={content.chooseCity.value}
						classNamePrefix="react-select"
						isClearable
					/>
				)}
				{errors.cityId && (
					<p className="text-red-500 text-sm">{errors.cityId.message}</p>
				)}
			</div>

			{/* Категория */}
			<div className="mb-4">
				<label className="block text-gray-700 mb-2">
					{content.category.value}
				</label>
				{loadingCategories ? (
					<Skeleton height={40} />
				) : (
					<Select
						options={categories}
						value={
							categories.find((cat) => cat.value == selectedCategoryId) || null
						}
						onChange={(option) => setValue('categoryId', option?.value)}
						placeholder={content.chooseCategory.value}
						classNamePrefix="react-select"
						isClearable
					/>
				)}
				{errors.categoryId && (
					<p className="text-red-500 text-sm">{errors.categoryId.message}</p>
				)}
			</div>

			{/* Телефон */}
			<div className="mb-4">
				<label className="block text-gray-700 mb-2">
					{content.phoneNumber.value}
				</label>
				{loadingJob ? (
					<Skeleton height={45} className="mb-3" />
				) : (
					<input
						type="text"
						{...register('phone')}
						className={`bg-white w-full border px-3 py-2 rounded ${
							errors.phone ? 'border-red-500' : 'border-gray-300'
						}`}
					/>
				)}
				{errors.phone && (
					<p className="text-red-500 text-sm">{errors.phone.message}</p>
				)}
			</div>

			{/* Изображение вакансии */}
			<div className="mb-4">
				<ImageUpload
					onImageUpload={onImageUpload}
					currentImageUrl={currentImageUrl}
				/>
			</div>

			{/* Описание */}
			<div className="mb-4">
				<label className="block text-gray-700 mb-2">
					{content.description.value}
				</label>
				{loadingJob ? (
					<Skeleton height={90} className="mb-3" />
				) : (
					<textarea
						{...register('description')}
						className={`bg-white w-full border px-3 py-2 rounded ${
							errors.description ? 'border-red-500' : 'border-gray-300'
						}`}
						rows="5"
					/>
				)}
				{errors.description && (
					<p className="text-red-500 text-sm">{errors.description.message}</p>
				)}
			</div>

			{/* Подвозка */}
			<div className="form-check mb-2">
				<input
					className="form-check-input"
					type="checkbox"
					id="shuttleCheckbox"
					{...register('shuttle')}
				/>
				<label className="form-check-label" htmlFor="shuttleCheckbox">
					{content.shuttle.value}
				</label>
			</div>
			{/* Питание */}
			<div className="form-check mb-4">
				<input
					className="form-check-input"
					type="checkbox"
					id="mealsCheckbox"
					{...register('meals')}
				/>
				<label className="form-check-label" htmlFor="mealsCheckbox">
					{content.meals.value}
				</label>
			</div>
		</>
	);
};

EditJobFields.propTypes = {
	register: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	setValue: PropTypes.func.isRequired,
	selectedCityId: PropTypes.number,
	selectedCategoryId: PropTypes.number,
	cities: PropTypes.array.isRequired,
	categories: PropTypes.array.isRequired,
	loadingCities: PropTypes.bool.isRequired,
	loadingCategories: PropTypes.bool.isRequired,
	loadingJob: PropTypes.bool.isRequired,
	onImageUpload: PropTypes.func,
	currentImageUrl: PropTypes.string,
};

export { EditJobFields };
