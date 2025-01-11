import { useTranslation } from "react-i18next";

const JobForm = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center px-4 mt-20 mb-40">
      {/* Родительский контейнер с отступами */}
      <div className="job-form mt-10 w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-6 bg-white rounded-lg shadow-md">
        {/* Контейнер формы с реактивным max-width */}
        <h1 className="text-2xl font-bold mb-4 text-center">
          {t("create_new_advertisement")}
        </h1>
        <form>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 mb-2">
              {t("job_title")}
            </label>
            <input
              id="title"
              type="text"
              name="title"
              className="bg-white w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("write_job_title")}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="salary" className="block text-gray-700 mb-2">
              {t("salary_per_hour")}
            </label>
            <input
              id="salary"
              type="text"
              name="salary"
              className="bg-white w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("write_salary")}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 mb-2">
              {t("location")}
            </label>
            <input
              id="location"
              type="text"
              name="location"
              className="bg-white w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("write_city_or_detailed_address")}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="number" className="block text-gray-700 mb-2">
              {t("phone_number")}
            </label>
            <input
              id="number"
              type="text"
              name="number"
              className="bg-white w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("write_phone_number")}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 mb-2">
              {t("description")}
            </label>
            <textarea
              id="description"
              name="description"
              className="bg-white w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
              placeholder={t("write_job_description")}
              required
            ></textarea>
          </div>
          {/* Поле для загрузки изображения */}
          <div className="mb-4">
            <div className="flex items-center">
              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
              />
              <label
                htmlFor="image"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i className="bi bi-image me-2 text-gray-500"></i>
                {t("add_image")}
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full text-white px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2"
          >
            {t("create")}
          </button>
        </form>
      </div>
    </div>
  );
};

export { JobForm };
