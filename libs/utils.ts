import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'react-hot-toast';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const showToastError = (error: any) => {
	if (error.response?.data?.error) {
		toast.error(error.response.data.error);
	} else {
		toast.error('Ошибка при создании объявления. Попробуйте позже.');
	}
};

export const showToastSuccess = (message: string) => {
	toast.success(message);
};
