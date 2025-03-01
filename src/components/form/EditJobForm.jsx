import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { jobSchema } from './JobFormSchema'; // Подключаем схему валидации
import useFetchCities from '../../hooks/useFetchCities';
import useFetchJob from '../../hooks/useUpdateJobs';
import { updateJob } from '../../../server/editFormService';
import { showToastError, showToastSuccess } from '../../../server/utils/toastUtils';
import { EditJobFields } from './EditJobFields';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

const EditJobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cities, loading: loadingCities } = useFetchCities();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(jobSchema), // Добавляем валидацию через zodResolver
    defaultValues: { 
      title: '', 
      salary: '', 
      cityId: undefined, 
      phone: '', 
      description: '' 
    },
  });

  const selectedCityId = watch('cityId');
  const { loading: loadingJob } = useFetchJob(id, setValue);

  const onSubmit = async (data) => {
    try {
      await updateJob(id, { ...data, cityId: parseInt(data.cityId) });
      showToastSuccess('Объявление успешно обновлено!');
      navigate('/');
    } catch (error) {
      showToastError(error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1 d-flex justify-content-center align-items-center px-4">
        <div className="job-form my-5 w-full max-w-xl p-6 bg-white rounded-lg">
          <h1 className="text-2xl font-bold mb-4 mt-5 text-center">{t('edit_advertisement')}</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <EditJobFields
              register={register}
              errors={errors}
              setValue={setValue}
              selectedCityId={selectedCityId}
              cities={cities}
              loadingCities={loadingCities}
              loadingJob={loadingJob}
            />

            <button type="submit" className="btn btn-primary w-full text-white px-4 py-2 rounded">
              {t('save')}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export { EditJobForm };
