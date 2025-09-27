import { useLoading } from '@/contexts';
import { useEffect, useState } from 'react';

const ProgressBar = () => {
	const { isLoading, progress } = useLoading();
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (isLoading) {
			setIsVisible(true);
		} else {
			// Delay hiding to allow for smooth animation
			const timer = setTimeout(() => {
				setIsVisible(false);
			}, 300);
			return () => clearTimeout(timer);
		}
	}, [isLoading]);

	if (!isVisible) return null;

	return (
		<div className="fixed top-0 left-0 w-full z-50">
			<div
				className="h-1 bg-blue-500 transition-all duration-300 ease-out"
				style={{
					width: `${progress}%`,
					boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
				}}
			/>
		</div>
	);
};

export default ProgressBar;
