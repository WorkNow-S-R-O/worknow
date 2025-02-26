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

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Валидация с помощью Zod
const jobSchema = z.object({
  title: z.string().min(3, 'Минимум 3 символа').max(100, 'Максимум 100 символов'),
  salary: z.string().regex(/^\d+$/, 'Можно вводить только цифры'),
  cityId: z.number({ required_error: 'Выберите город' }),
  phone: z.string().regex(/^\d+$/, 'Можно вводить только цифры').min(7, 'Минимум 7 цифр'),
  description: z.string().min(10, 'Минимум 10 символов').max(5000, 'Максимум 5000 символов'),
});

const EditJobForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingJob, setLoadingJob] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      salary: '',
      cityId: undefined,
      phone: '',
      description: '',
    },
  });

  const selectedCityId = watch('cityId');

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
        setLoadingCities(false);
      }
    };

    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/jobs/${id}`);
        const job = response.data;

        setValue('title', job.title);
        setValue('salary', job.salary);
        setValue('cityId', job.city.id);
        setValue('phone', job.phone);
        setValue('description', job.description);
      } catch (error) {
        toast.error('Ошибка загрузки объявления');
        navigate('/');
      } finally {
        setLoadingJob(false);
      }
    };

    fetchCities();
    fetchJob();
  }, [id, navigate, setValue]);

  const onSubmit = async (data) => {
    try {
      await axios.put(`http://localhost:3001/api/jobs/${id}`, {
        ...data,
        cityId: parseInt(data.cityId),
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
        <div className="job-form my-5 w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-6 bg-white rounded-lg">
          <h1 className="text-2xl font-bold mb-4 mt-5 text-center">{t('edit_advertisement')}</h1>

          {loadingJob ? (
            <div>
              <Skeleton height={45} className="mb-3" />
              <Skeleton height={45} className="mb-3" />
              <Skeleton height={45} className="mb-3" />
              <Skeleton height={45} className="mb-3" />
              <Skeleton height={90} className="mb-3" />
              <Skeleton height={45} />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('job_title')}</label>
                <input
                  type="text"
                  {...register('title')}
                  className={`bg-white w-full border px-3 py-2 rounded ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('salary_per_hour')}</label>
                <input
                  type="text"
                  {...register('salary')}
                  className={`bg-white w-full border px-3 py-2 rounded ${
                    errors.salary ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.salary && <p className="text-red-500 text-sm">{errors.salary.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('location')}</label>
                {loadingCities ? (
                  <Skeleton height={40} />
                ) : (
                  <Select
                    options={cities}
                    value={cities.find((city) => city.value === selectedCityId) || null}
                    onChange={(option) => setValue('cityId', option?.value)}
                    placeholder={t('choose_city')}
                    classNamePrefix="react-select"
                    isClearable
                  />
                )}
                {errors.cityId && <p className="text-red-500 text-sm">{errors.cityId.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('phone_number')}</label>
                <input
                  type="text"
                  {...register('phone')}
                  className={`bg-white w-full border px-3 py-2 rounded ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('description')}</label>
                <textarea
                  {...register('description')}
                  className={`bg-white w-full border px-3 py-2 rounded ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows="5"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-full text-white px-4 py-2 rounded">
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
