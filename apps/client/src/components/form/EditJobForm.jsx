import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { jobSchema } from './JobFormSchema';
import useFetchCities from '../../hooks/useFetchCities';
import useFetchCategories from '../../hooks/useFetchCategories';
import useFetchJob from '../../hooks/useUpdateJobs';
import { updateJob } from 'libs/jobs';
import { showToastError, showToastSuccess } from 'libs/utils';
import { EditJobFields } from './EditJobFields';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async'; // 🔹 SEO
import { useLoadingProgress } from '../../hooks/useLoadingProgress';

const EditJobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { cities, loading: loadingCities } = useFetchCities();
  const { categories, loading: loadingCategories } = useFetchCategories();
  const { startLoadingWithProgress, completeLoading } = useLoadingProgress();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: { 
      title: '', 
      salary: '', 
      cityId: undefined, 
      categoryId: undefined,
      phone: '', 
      description: '',
      shuttle: false,
      meals: false
    },
  });

  const selectedCityId = watch('cityId');
  const selectedCategoryId = watch('categoryId');
  const { loading: loadingJob, job } = useFetchJob(id, setValue);
  const [imageUrl, setImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set initial image URL when job data is loaded
  useEffect(() => {
    console.log('🔍 EditJobForm - Job data loaded:', job);
    if (job && job.imageUrl) {
      console.log('🔍 EditJobForm - Setting image URL:', job.imageUrl);
      setImageUrl(job.imageUrl);
    } else {
      console.log('🔍 EditJobForm - No image URL found in job data');
    }
  }, [job]);

  const onSubmit = async (data) => {
    if (!user) {
      showToastError({ response: { data: { error: 'Вы должны быть авторизованы!' } } });
      return;
    }

    setIsSubmitting(true);
    startLoadingWithProgress(2500); // Start loading progress for form submission
    
    try {
      const token = await getToken();
      const updatedData = {
        ...data,
        cityId: data.cityId ? parseInt(data.cityId, 10) : null,
        categoryId: data.categoryId ? parseInt(data.categoryId, 10) : null,
        shuttle: !!data.shuttle,
        meals: !!data.meals,
        imageUrl: imageUrl // Include the image URL in the update
      };
      await updateJob(id, updatedData, token);
      completeLoading(); // Complete loading when done
      showToastSuccess('Объявление успешно обновлено!');
      navigate('/');
    } catch (error) {
      completeLoading(); // Complete loading even on error
      showToastError(error);
    } finally {
      setIsSubmitting(false);
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
              onImageUpload={setImageUrl}
              currentImageUrl={imageUrl}
            />

            <button 
              type="submit" 
              className="btn btn-primary w-full text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {t('saving')}...
                </>
              ) : (
                t('save')
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export { EditJobForm };
