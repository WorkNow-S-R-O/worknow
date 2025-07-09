import { toast } from 'react-hot-toast';

export const showToastError = (error) => {
  console.error('Ошибка:', error.response?.data || error.message);
  if (error.response?.data?.error) {
    toast.error(error.response.data.error);
  } else {
    toast.error('Ошибка при создании объявления. Попробуйте позже.');
  }
};

export const showToastSuccess = (message) => {
  toast.success(message);
};
