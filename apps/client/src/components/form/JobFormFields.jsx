import PropTypes from "prop-types";
import Select from "react-select";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import ImageUpload from "../ui/ImageUpload";

export const JobFormFields = ({
  register,
  errors,
  setValue,
  selectedCityId,
  selectedCategoryId,
  cities,
  categories,
  loading,
  onImageUpload,
  currentImageUrl,
  isSubmitting = false,
}) => {
  const { t } = useTranslation();
  const [isAgreed, setIsAgreed] = useState(false);

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
        <label htmlFor="title" className="block text-gray-700 mb-2">
          {t("job_title")}
        </label>
        <input
          id="title"
          type="text"
          {...register("title")}
          className={`bg-white w-full border px-3 py-2 rounded ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={t("write_job_title")}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Зарплата */}
      <div className="mb-4">
        <label htmlFor="salary" className="block text-gray-700 mb-2">
          {t("salary_per_hour")}
        </label>
        <input
          id="salary"
          type="text"
          {...register("salary")}
          className={`bg-white w-full border px-3 py-2 rounded ${
            errors.salary ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={t("write_salary")}
        />
        {errors.salary && (
          <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>
        )}
      </div>

      {/* Город */}
      <div className="mb-4">
        <label htmlFor="cityId" className="block text-gray-700 mb-2">
          {t("location")}
        </label>
        {loading ? (
          <Skeleton height={40} />
        ) : (
          <Select
            options={sortedCities}
            value={sortedCities.find((city) => city.value === selectedCityId) || null}
            onChange={(option) => setValue("cityId", option?.value)}
            placeholder={t("location_placeholder")}
            classNamePrefix="react-select"
            isClearable
          />
        )}
        {errors.cityId && (
          <p className="text-red-500 text-sm mt-1">{errors.cityId.message}</p>
        )}
      </div>

      {/* Категория */}
      <div className="mb-4">
        <label htmlFor="categoryId" className="block text-gray-700 mb-2">
          {t("category")}
        </label>
        {loading ? (
          <Skeleton height={40} />
        ) : (
          <Select
            options={categories}
            value={categories.find((category) => category.value === selectedCategoryId) || null}
            onChange={(option) => setValue("categoryId", option?.value)}
            placeholder={t("category_placeholder")}
            classNamePrefix="react-select"
            isClearable
          />
        )}
        {errors.categoryId && (
          <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
        )}
      </div>

      {/* Телефон */}
      <div className="mb-4">
        <label htmlFor="phone" className="block text-gray-700 mb-2">
          {t("phone_number")}
        </label>
        <input
          id="phone"
          type="text"
          {...register("phone")}
          className={`bg-white w-full border px-3 py-2 rounded ${
            errors.phone ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={t("write_phone_number")}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
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
        <label htmlFor="description" className="block text-gray-700 mb-2">
          {t("description")}
        </label>
        <textarea
          id="description"
          {...register("description")}
          className={`bg-white w-full border px-3 py-2 rounded ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          rows="5"
          placeholder={t("write_job_description")}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Подвозка */}
      <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          id="shuttleCheckbox"
          {...register("shuttle")}
        />
        <label className="form-check-label" htmlFor="shuttleCheckbox">
          {t("shuttle") || "Подвозка"}
        </label>
      </div>
      {/* Питание */}
      <div className="form-check mb-4">
        <input
          className="form-check-input"
          type="checkbox"
          id="mealsCheckbox"
          {...register("meals")}
        />
        <label className="form-check-label" htmlFor="mealsCheckbox">
          {t("meals") || "Питание"}
        </label>
      </div>

      {/* Terms of use agreement checkbox */}
      <div className="form-check mb-4 flex items-center">
        <input
          className="form-check-input"
          type="checkbox"
          id="terms"
          checked={isAgreed}
          onChange={() => setIsAgreed(!isAgreed)}
        />
        <label className="form-check-label ms-2" htmlFor="terms">
          {t("terms_agreement")}{' '}
          <a
            href="https://www.termsfeed.com/live/8e93e788-90eb-4c96-b48c-18d31910ddca"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {t("terms_agreement_link")}
          </a>
        </label>
      </div>

      {/* Кнопка отправки */}
      <button
        type="submit"
        className={`btn btn-primary w-full text-white px-4 py-2 rounded ${
          !isAgreed || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!isAgreed || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {t('publishing')}...
          </>
        ) : (
          t("create")
        )}
      </button>
    </>
  );
};

// **Валидация пропсов**
JobFormFields.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  selectedCityId: PropTypes.number,
  selectedCategoryId: PropTypes.number,
  cities: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  onImageUpload: PropTypes.func, // (url: string, file: File) => void
  currentImageUrl: PropTypes.string,
  isSubmitting: PropTypes.bool,
};

export default JobFormFields;
