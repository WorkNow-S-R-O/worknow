import { useEffect, useState } from 'react';
import { Navbar } from './index';
import { Footer } from './index';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Select from 'react-select';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const EditJobForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    salary: '',
    cityId: '',
    phone: '',
    description: '',
  });

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingJob, setLoadingJob] = useState(true);

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
        toast.error('Не удалось загрузить города');
      } finally {
        setLoading(false);
      }
    };

    const fetchJob = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/jobs');
        const job = response.data.find((job) => job.id === parseInt(id));

        if (!job) {
          toast.error('Объявление не найдено');
          navigate('/');
          return;
        }

        setFormData({
          title: job.title,
          salary: job.salary,
          cityId: job.city.id,
          phone: job.phone,
          description: job.description,
        });
      } catch (error) {
        toast.error('Ошибка загрузки объявления');
      } finally {
        setLoadingJob(false);
      }
    };

    fetchCities();
    fetchJob();
  }, [id, navigate]);

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

    try {
      await axios.put(`http://localhost:3001/api/jobs/${id}`, {
        ...formData,
        cityId: parseInt(formData.cityId),
      });

      toast.success('Объявление обновлено!');
      navigate('/');
    } catch (error) {
      console.error('Ошибка обновления объявления:', error);
      toast.error('Ошибка при обновлении объявления');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
  
      <div className="flex-grow-1 d-flex justify-content-center align-items-center px-4">
        <div className="job-form my-5 w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 mt-5 text-center">{t('edit_advertisement')}</h1>
  
          {loadingJob ? (
            <Skeleton height={400} />
          ) : (
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
                    placeholder={t('choose_city')}
                    classNamePrefix="react-select"
                    isClearable
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
                  required
                ></textarea>
              </div>
  
              <button
                type="submit"
                className="btn btn-primary w-full text-white px-4 py-2 rounded"
              >
                {t('save')}
              </button>
            </form>
          )}
        </div>
      </div>
  
      <Footer />
    </div>
  );

};

export default EditJobForm;
