import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import PropTypes from 'prop-types';
import { jobSchema } from './JobFormSchema';
import useFetchCities from '../../hooks/useFetchCities';
import useFetchCategories from '../../hooks/useFetchCategories';
import { createJob } from '../../../server/formService';
import { showToastError, showToastSuccess } from '../../../server/utils/toastUtils';
import {JobFormFields} from './JobFormFields';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const JobForm = ({ onJobCreated }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cities, loading: citiesLoading } = useFetchCities();
  const { categories, loading: categoriesLoading } = useFetchCategories();
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
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

  const onSubmit = async (data) => {
    if (!user) {
      showToastError({ response: { data: { error: 'Вы должны быть авторизованы!' } } });
      return;
    }

    try {
      const formData = new FormData();
      Object.entries({
        ...data,
        cityId: parseInt(data.cityId),
        categoryId: parseInt(data.categoryId),
        userId: user.id,
        shuttle: !!data.shuttle,
        meals: !!data.meals
      }).forEach(([key, value]) => formData.append(key, value));
      selectedImages.forEach((file) => formData.append('images', file));

      await createJob(formData);
      showToastSuccess('Объявление успешно создано!');
      reset();
      setSelectedImages([]);
      setPreviewImages([]);
      if (onJobCreated) onJobCreated();
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      showToastError(error);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    setPreviewImages(files.map(file => URL.createObjectURL(file)));
  };

  const handleRemoveImage = (idx) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== idx));
    setPreviewImages(prev => prev.filter((_, i) => i !== idx));
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
            selectedCategoryId={selectedCategoryId}
            cities={cities}
            categories={categories}
            loading={citiesLoading || categoriesLoading}
            selectedImages={selectedImages}
            previewImages={previewImages}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
          />
        </form>
      </div>
    </div>
  );
};

JobForm.propTypes = {
  onJobCreated: PropTypes.func,
};

export { JobForm };
