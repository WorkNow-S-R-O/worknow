import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { jobSchema } from './JobFormSchema';
import useFetchCities from '../../hooks/useFetchCities';
import { createJob } from '../../../server/formService';
import { showToastError, showToastSuccess } from '../../../server/utils/toastUtils';
import JobFormFields from './JobFormFields';
import { useTranslation } from 'react-i18next';

const JobForm = ({ onJobCreated }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cities, loading } = useFetchCities();

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: { title: '', salary: '', cityId: undefined, phone: '', description: '' },
  });

  const selectedCityId = watch('cityId');

  const onSubmit = async (data) => {
    if (!user) {
      showToastError({ response: { data: { error: 'Вы должны быть авторизованы!' } } });
      return;
    }

    try {
      await createJob({ ...data, cityId: parseInt(data.cityId), userId: user.id });
      showToastSuccess('Объявление успешно создано!');
      reset();
      if (onJobCreated) onJobCreated();
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      showToastError(error);
    }
  };

  return (
    <div className="flex-grow-1 d-flex justify-content-center align-items-center px-4">
      <div className="job-form my-5 w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-6 bg-white rounded-lg ">
        <h1 className="text-2xl font-bold mb-4 mt-5 text-center">{t('create_new_advertisement')}</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <JobFormFields 
            register={register} 
            errors={errors} 
            setValue={setValue} 
            selectedCityId={selectedCityId} 
            cities={cities} 
            loading={loading} 
          />

          <button type="submit" className="btn btn-primary w-full text-white px-4 py-2 rounded">
            {t('create')}
          </button>
        </form>
      </div>
    </div>
  );
};

export { JobForm };
