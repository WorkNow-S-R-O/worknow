import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'react-hot-toast';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const showToastError = (error) => {
	const fallbackMessage = 'Ошибка при создании объявления. Попробуйте позже.';
	if (error?.response?.data?.error) {
		toast.error(error.response.data.error);
	} else {
		toast.error(fallbackMessage);
	}
};

export const showToastSuccess = (message) => {
	toast.success(message);
};
