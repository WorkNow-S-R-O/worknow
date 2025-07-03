import PropTypes from "prop-types";
import Select from "react-select";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export const JobFormFields = ({
  register,
  errors,
  setValue,
  selectedCityId,
  selectedCategoryId,
  cities,
  categories,
  loading,
  previewImages,
  handleImageChange,
  handleRemoveImage,
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
            placeholder="Выберите город"
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
            placeholder="Выберите категорию"
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

      {/* Загрузка изображений */}
      <div className="mb-4">
        <label className="form-label">{t('add_images_optional')}</label>
        <div style={{ width: '100%' }}>
          <input
            type="file"
            accept="image/*"
            id="job-image-upload"
            style={{ display: 'none' }}
            onChange={handleImageChange}
            disabled={previewImages && previewImages.length > 0}
            max={5}
          />
          <label htmlFor="job-image-upload" className="form-control d-flex align-items-center" style={{ cursor: 'pointer', height: '38px', padding: 0, marginBottom: 0 }}>
            <i className="bi bi-image" style={{ fontSize: 20, marginLeft: 8 }}></i>
            <div style={{ width: 1, height: '60%', background: '#ddd', margin: '0 12px' }}></div>
            <span style={{ color: '#888', fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {previewImages && previewImages.length > 0
                ? previewImages.length === 1
                  ? (document.getElementById('job-image-upload')?.files?.[0]?.name || 'Файл выбран')
                  : Array.from(document.getElementById('job-image-upload')?.files || []).map(f => f.name).join(', ')
                : 'Файл не выбран'}
            </span>
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          {previewImages && previewImages.map((src, idx) => (
            <div
              key={idx}
              style={{ position: 'relative', width: 64, height: 64, display: 'inline-block' }}
              className="image-preview-wrapper"
            >
              <img
                src={src}
                alt={`preview-${idx}`}
                style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
              />
              <button
                type="button"
                onClick={e => { e.stopPropagation(); handleRemoveImage(idx); }}
                className="remove-image-btn custom-cross"
                tabIndex={-1}
                aria-label="Удалить изображение"
              >
                ×
              </button>
            </div>
          ))}
        </div>
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

      {/* Чекбокс "Согласие с пользовательским соглашением" */}
      <div className="form-check mb-4 flex items-center">
        <input
          className="form-check-input"
          type="checkbox"
          id="terms"
          checked={isAgreed}
          onChange={() => setIsAgreed(!isAgreed)}
        />
        <label className="form-check-label ms-2" htmlFor="terms">
          Я согласен с{' '}
          <a
            href="https://www.termsfeed.com/live/8e93e788-90eb-4c96-b48c-18d31910ddca"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            пользовательским соглашением
          </a>
        </label>
      </div>

      {/* Кнопка отправки */}
      <button
        type="submit"
        className={`btn btn-primary w-full text-white px-4 py-2 rounded ${
          !isAgreed ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!isAgreed}
      >
        {t("create")}
      </button>
    </>
  );
};

JobFormFields.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  selectedCityId: PropTypes.string.isRequired,
  selectedCategoryId: PropTypes.string.isRequired,
  cities: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  previewImages: PropTypes.array.isRequired,
  handleImageChange: PropTypes.func.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
};

/* CSS для показа крестика при наведении */
<style>
{`
.image-preview-wrapper:hover .remove-image-btn {
  display: flex !important;
}
`}
</style>