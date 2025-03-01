import PropTypes from 'prop-types';
import Select from 'react-select';
import Skeleton from 'react-loading-skeleton';
import { useTranslation } from "react-i18next";

export const JobFormFields = ({ register, errors, setValue, selectedCityId, cities, loading }) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Название вакансии */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 mb-2">
          {t('job_title')}
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className={`bg-white w-full border px-3 py-2 rounded ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={t('write_job_title')}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      {/* Зарплата */}
      <div className="mb-4">
        <label htmlFor="salary" className="block text-gray-700 mb-2">
          {t('salary_per_hour')}
        </label>
        <input
          id="salary"
          type="text"
          {...register('salary')}
          className={`bg-white w-full border px-3 py-2 rounded ${
            errors.salary ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={t('write_salary')}
        />
        {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>}
      </div>

      {/* Город */}
      <div className="mb-4">
        <label htmlFor="cityId" className="block text-gray-700 mb-2">
          {t('location')}
        </label>
        {loading ? (
          <Skeleton height={40} />
        ) : (
          <Select
            options={cities}
            value={cities.find((city) => city.value === selectedCityId) || null}
            onChange={(option) => setValue('cityId', option?.value)}
            placeholder="Выберите город"
            classNamePrefix="react-select"
            isClearable
          />
        )}
        {errors.cityId && <p className="text-red-500 text-sm mt-1">{errors.cityId.message}</p>}
      </div>

      {/* Телефон */}
      <div className="mb-4">
        <label htmlFor="phone" className="block text-gray-700 mb-2">
          {t('phone_number')}
        </label>
        <input
          id="phone"
          type="text"
          {...register('phone')}
          className={`bg-white w-full border px-3 py-2 rounded ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={t('write_phone_number')}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
      </div>

      {/* Описание */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 mb-2">
          {t('description')}
        </label>
        <textarea
          id="description"
          {...register('description')}
          className={`bg-white w-full border px-3 py-2 rounded ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          rows="5"
          placeholder={t('write_job_description')}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>
    </>
  );
};

// **Валидация пропсов**
JobFormFields.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  selectedCityId: PropTypes.number,
  cities: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default JobFormFields;
