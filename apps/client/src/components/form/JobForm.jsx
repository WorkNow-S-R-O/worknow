import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { jobSchema } from './JobFormSchema';
import useFetchCities from '../../hooks/useFetchCities';
import useFetchCategories from '../../hooks/useFetchCategories';
import { createJob, createJobWithImage } from 'libs/jobs';
import { showToastError, showToastSuccess } from 'libs/utils';
import JobFormFields from './JobFormFields';
import { useIntlayer } from "react-intlayer";
import { useLoadingProgress } from '../../hooks/useLoadingProgress';

const JobForm = ({ onJobCreated }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const content = useIntlayer("jobForm");
  const { cities, loading: citiesLoading } = useFetchCities();
  const { categories, loading: categoriesLoading } = useFetchCategories();
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startLoadingWithProgress, completeLoading } = useLoadingProgress();

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
      showToastError({ response: { data: { error: content.mustBeAuthorized.value } } });
      return;
    }

    setIsSubmitting(true);
    startLoadingWithProgress(3000); // Start loading progress for form submission

    try {
      const token = await getToken();
      
      // If we have an image file, use the S3 upload endpoint for job creation
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('title', data.title);
        formData.append('salary', data.salary);
        formData.append('phone', data.phone);
        formData.append('description', data.description);
        formData.append('cityId', data.cityId.toString());
        formData.append('categoryId', data.categoryId.toString());
        formData.append('shuttle', data.shuttle.toString());
        formData.append('meals', data.meals.toString());

        await createJobWithImage(formData, token);
      } else {
        // Use regular job creation without image
        await createJob({ 
          ...data, 
          cityId: parseInt(data.cityId), 
          categoryId: parseInt(data.categoryId),
          userId: user.id,
          shuttle: !!data.shuttle,
          meals: !!data.meals
        }, token);
      }
      
      completeLoading(); // Complete loading when done
      showToastSuccess(content.jobCreatedSuccess.value);
      reset();
      setImageFile(null);
      setImageUrl(null);
      if (onJobCreated) onJobCreated();
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      completeLoading(); // Complete loading even on error
      showToastError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow-1 d-flex justify-content-center align-items-center px-4">
      <div className="job-form my-5 w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-6 bg-white rounded-lg ">
        <h1 className="text-2xl font-bold mb-4 mt-5 text-center">{content.createNewAdvertisement.value}</h1>

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
            onImageUpload={(url, file) => {
              setImageUrl(url);
              setImageFile(file);
            }}
            currentImageUrl={imageUrl}
            isSubmitting={isSubmitting}
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
