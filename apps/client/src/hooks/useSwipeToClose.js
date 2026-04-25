import { useState } from 'react';

export const useSwipeToClose = ({
	onClose,
	minSwipeDistance = 50,
	shouldHandleTouch = () => true,
}) => {
	const [touchStart, setTouchStart] = useState(null);
	const [touchEnd, setTouchEnd] = useState(null);

	const onTouchStart = (e) => {
		if (!shouldHandleTouch(e)) return;
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientY);
	};

	const onTouchMove = (e) => {
		if (!shouldHandleTouch(e)) return;
		setTouchEnd(e.targetTouches[0].clientY);
	};

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) return;
		const distance = touchStart - touchEnd;
		const isUpSwipe = distance > minSwipeDistance;

		if (isUpSwipe) {
			onClose();
		}
	};

	return { onTouchStart, onTouchMove, onTouchEnd };
};
