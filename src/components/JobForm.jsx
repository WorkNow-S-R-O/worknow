import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

const JobForm = ({ onJobCreated }) => {
  const { t } = useTranslation();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    title: '',
    salary: '',
    cityId: '',
    phone: '',
    description: '',
  });

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/cities');
        const formattedCities = response.data.map((city) => ({
          value: city.id,
          label: city.name,
        }));
        setCities(formattedCities);
      } catch (error) {
        console.error('Ошибка получения городов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCityChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      cityId: selectedOption ? selectedOption.value : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Вы должны быть авторизованы');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/jobs', {
        ...formData,
        cityId: parseInt(formData.cityId),
        userId: user.id,
      });

      console.log('Объявление создано:', response.data);
      alert('Объявление успешно создано!');

      setFormData({
        title: '',
        salary: '',
        cityId: '',
        phone: '',
        description: '',
      });

      if (onJobCreated) {
        onJobCreated(response.data);
      }
    } catch (error) {
      console.error('Ошибка при создании объявления:', error.response?.data || error.message);
      alert('Ошибка при создании объявления');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center px-4 m-auto relative">
      <div className="job-form my-5 w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 mt-5 text-center">{t('create_new_advertisement')}</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 mb-2">{t('job_title')}</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="bg-white w-full border border-gray-300 px-3 py-2 rounded"
              placeholder={t('write_job_title')}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="salary" className="block text-gray-700 mb-2">{t('salary_per_hour')}</label>
            <input
              id="salary"
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="bg-white w-full border border-gray-300 px-3 py-2 rounded"
              placeholder={t('write_salary')}
              required
            />
          </div>

          <div className="mb-4">
  <label htmlFor="cityId" className="block text-gray-700 mb-2">{t('location')}</label>
  {loading ? (
    <Skeleton height={40} />
  ) : (
    <Select
      options={cities}
      value={cities.find((city) => city.value === formData.cityId) || null}
      onChange={handleCityChange}
      placeholder="Выберите город"
      classNamePrefix="react-select"
      isClearable
      menuPlacement="auto"
      maxMenuHeight={160}
    />
  )}
</div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 mb-2">{t('phone_number')}</label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="bg-white w-full border border-gray-300 px-3 py-2 rounded"
              placeholder={t('write_phone_number')}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 mb-2">{t('description')}</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-white w-full border border-gray-300 px-3 py-2 rounded"
              rows="5"
              placeholder={t('write_job_description')}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full text-white px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2"
          >
            {t('create')}
          </button>
        </form>
      </div>
    </div>
  );
};

export { JobForm };
