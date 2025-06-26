import PropTypes from 'prop-types';
import Select from 'react-select';
import Skeleton from 'react-loading-skeleton';
import { useTranslation } from "react-i18next";

const EditJobFields = ({ register, errors, setValue, selectedCityId, selectedCategoryId, cities, categories, loadingCities, loadingCategories, loadingJob }) => {
  const { t } = useTranslation();

  // Сортировка: регионы в начале, остальные города после
  const regionOrder = [
    ['Центр страны', 'מרכז הארץ', 'Center'],
    ['Юг страны', 'דרום הארץ', 'South'],
    ['Север страны', 'צפון הארץ', 'North'],
  ];
  const regions = regionOrder
    .map(labels => cities.find(city => labels.includes(city.label || city.name)))
    .filter(Boolean);
  const otherCities = cities.filter(city => !regions.includes(city));
  const sortedCities = [...regions, ...otherCities];

  return (
    <>
      {/* Название вакансии */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">{t('job_title')}</label>
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
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      {/* Зарплата в час */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">{t('salary_per_hour')}</label>
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
        {errors.salary && <p className="text-red-500 text-sm">{errors.salary.message}</p>}
      </div>

      {/* Город */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">{t('location')}</label>
        {loadingCities ? (
          <Skeleton height={40} />
        ) : (
          <Select
            options={sortedCities}
            value={sortedCities.find((city) => city.value == selectedCityId) || null}
            onChange={(option) => setValue('cityId', option?.value)}
            placeholder={t('choose_city')}
            classNamePrefix="react-select"
            isClearable
          />
        )}
        {errors.cityId && <p className="text-red-500 text-sm">{errors.cityId.message}</p>}
      </div>

      {/* Категория */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">{t('category')}</label>
        {loadingCategories ? (
          <Skeleton height={40} />
        ) : (
          <Select
            options={categories}
            value={categories.find((cat) => cat.value == selectedCategoryId) || null}
            onChange={(option) => setValue('categoryId', option?.value)}
            placeholder={t('choose_category')}
            classNamePrefix="react-select"
            isClearable
          />
        )}
        {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
      </div>

      {/* Телефон */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">{t('phone_number')}</label>
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
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
      </div>

      {/* Описание */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">{t('description')}</label>
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
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
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
};

export { EditJobFields };
