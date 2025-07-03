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
import { Helmet } from 'react-helmet-async'; // 🔹 SEO
import { useState } from 'react';

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
      description: '',
      shuttle: false,
      meals: false
    },
  });

  const selectedCityId = watch('cityId');
  const selectedCategoryId = watch('categoryId');
  const { loading: loadingJob, job } = useFetchJob(id, setValue);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('cityId', data.cityId ? parseInt(data.cityId, 10) : '');
      formData.append('categoryId', data.categoryId ? parseInt(data.categoryId, 10) : '');
      formData.append('shuttle', !!data.shuttle);
      formData.append('meals', !!data.meals);
      formData.append('title', data.title);
      formData.append('salary', data.salary);
      formData.append('phone', data.phone);
      formData.append('description', data.description);
      if (selectedImage) formData.append('images', selectedImage);
      if (removeImage) formData.append('removeImage', '1');
      await updateJob(id, formData);
      showToastSuccess('Объявление успешно обновлено!');
      navigate('/');
    } catch (error) {
      showToastError(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreviewImage(file ? URL.createObjectURL(file) : null);
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    setRemoveImage(true);
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
              previewImage={previewImage}
              selectedImage={selectedImage}
              removeImage={removeImage}
              handleImageChange={handleImageChange}
              handleRemoveImage={handleRemoveImage}
              job={job}
            />

            <button type="submit" className="btn btn-primary w-full text-white px-4 py-2 rounded">
              {t('save')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export { EditJobForm };
