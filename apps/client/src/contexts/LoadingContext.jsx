import { createContext, useContext, useState, useCallback } from 'react';

import PropTypes from 'prop-types';

const LoadingContext = createContext();

export const useLoading = () => {
	const context = useContext(LoadingContext);
	if (!context) {
		throw new Error('useLoading must be used within a LoadingProvider');
	}
	return context;
};

export const LoadingProvider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [progress, setProgress] = useState(0);

	const startLoading = useCallback(() => {
		// Prevent multiple loading states
		if (!isLoading) {
			setIsLoading(true);
			setProgress(0);
		}
	}, [isLoading]);

	const stopLoading = useCallback(() => {
		setIsLoading(false);
		setProgress(0);
	}, []);

	const updateProgress = useCallback((value) => {
		setProgress(Math.min(100, Math.max(0, value)));
	}, []);

	const value = {
		isLoading,
		progress,
		startLoading,
		stopLoading,
		updateProgress,
	};

	return (
		<LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
	);
};

LoadingProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
