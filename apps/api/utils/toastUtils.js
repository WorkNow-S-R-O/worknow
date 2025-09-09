import { toast } from 'react-hot-toast';

export const showToastError = (error) => {
	console.error('Ошибка:', error.response?.data || error.message);

	// Check if upgrade is required
	if (error.response?.data?.upgradeRequired) {
		toast.error(
			(t) => (
				<div>
					<div>{error.response.data.error}</div>
					<button
						onClick={() => (window.location.href = '/premium')}
						style={{
							background: '#1976d2',
							color: 'white',
							border: 'none',
							padding: '8px 16px',
							borderRadius: '4px',
							marginTop: '8px',
							cursor: 'pointer',
							fontSize: '14px',
						}}
					>
						Перейти на Premium
					</button>
				</div>
			),
			{ duration: 6000 },
		);
	} else if (error.response?.data?.error) {
		toast.error(error.response.data.error);
	} else {
		toast.error('Ошибка при создании объявления. Попробуйте позже.');
	}
};

export const showToastSuccess = (message) => {
	toast.success(message);
};
