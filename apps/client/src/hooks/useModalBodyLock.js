import { useEffect } from 'react';

export const useModalBodyLock = ({ isOpen, isMobile }) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
			if (isMobile) {
				document.body.style.position = 'fixed';
				document.body.style.width = '100%';
				const navbar = document.querySelector('nav, .navbar, header');
				if (navbar) {
					navbar.style.display = 'none';
				}
			}
		} else {
			document.body.style.overflow = '';
			if (isMobile) {
				document.body.style.position = '';
				document.body.style.width = '';
				const navbar = document.querySelector('nav, .navbar, header');
				if (navbar) {
					navbar.style.display = '';
				}
			}
		}
		return () => {
			document.body.style.overflow = '';
			if (isMobile) {
				document.body.style.position = '';
				document.body.style.width = '';
				const navbar = document.querySelector('nav, .navbar, header');
				if (navbar) {
					navbar.style.display = '';
				}
			}
		};
	}, [isOpen, isMobile]);
};
