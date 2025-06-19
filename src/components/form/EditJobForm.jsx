import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { jobSchema } from './JobFormSchema';
import useFetchCities from '../../hooks/useFetchCities';
import useFetchCategories from '../../hooks/useFetchCategories';
import useFetchJob from '../../hooks/useUpdateJobs';
import { updateJob } from '../../../server/editFormService';
import { showToastError, showToastSuccess } from '../../../server/utils/toastUtils';
import { EditJobFields } from './EditJobFields';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { Helmet } from 'react-helmet-async'; // 🔹 SEO

const EditJobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cities, loading: loadingCities } = useFetchCities();
  const { categories, loading: loadingCategories } = useFetchCategories();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: { 
      title: '', 
      salary: '', 
      cityId: undefined, 
      categoryId: undefined,
      phone: '', 
      description: '' 
    },
  });

  const selectedCityId = watch('cityId');
  const selectedCategoryId = watch('categoryId');
  const { loading: loadingJob, job } = useFetchJob(id, setValue);

  const onSubmit = async (data) => {
    try {
      await updateJob(id, { ...data, cityId: parseInt(data.cityId), categoryId: parseInt(data.categoryId) });
      showToastSuccess('Объявление успешно обновлено!');
      navigate('/');
    } catch (error) {
      showToastError(error);
    }
  };

  // 🔹 Динамический `title` и `description`
  const pageTitle = job ? `${t('edit_advertisement')}: ${job.title} | WorkNow` : t('edit_advertisement');
  const pageDescription = job ? `${t('edit_page_description')} ${job.title}` : t('edit_page_default_description');

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* 🔹 SEO-оптимизация */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

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
              selectedCategoryId={selectedCategoryId}
              cities={cities}
              categories={categories}
              loadingCities={loadingCities}
              loadingCategories={loadingCategories}
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
