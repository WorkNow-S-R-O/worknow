const JobForm = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      {/* Родительский контейнер с отступами */}
      <div className="job-form w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-6 bg-white rounded-lg shadow-md">
        {/* Контейнер формы с реактивным max-width */}
        <h1 className="text-2xl font-bold mb-4 text-center">
          Создать новую вакансию
        </h1>
        {/* Placeholder для сообщения об ошибке */}
        <p className="text-red-500 mb-4 text-center hidden">
          Ошибка при создании вакансии.
        </p>
        <form>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 mb-2">
              Название вакансии
            </label>
            <input
              id="title"
              type="text"
              name="title"
              className="bg-white w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите название вакансии"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="salary" className="block text-gray-700 mb-2">
              ЗП/час
            </label>
            <input
              id="salary"
              type="text"
              name="salary"
              className="bg-white w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите зарплату за час"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 mb-2">
              Местоположение
            </label>
            <input
              id="location"
              type="text"
              name="location"
              className="bg-white w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите город или точный адрес"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              className="bg-white w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
              placeholder="Введите описание вакансии"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Создать
          </button>
        </form>
      </div>
    </div>
  );
};

export { JobForm };
