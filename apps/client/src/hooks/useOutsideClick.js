import { useEffect } from 'react';

export const useOutsideClick = ({ ref, isOpen, onClose, isMobile }) => {
	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (ref.current && !ref.current.contains(event.target)) {
				onClose();
			}
		};

		if (isOpen && !isMobile) {
			document.addEventListener('mousedown', handleOutsideClick);
		}

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isOpen, onClose, isMobile, ref]);
};
