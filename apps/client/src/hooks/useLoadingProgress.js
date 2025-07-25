import { useLoading } from '../contexts/LoadingContext';
import { useEffect, useRef, useCallback } from 'react';

export const useLoadingProgress = () => {
  const { startLoading, stopLoading, updateProgress } = useLoading();
  const intervalRef = useRef(null);

  const startLoadingWithProgress = useCallback((duration = 2000) => {
    startLoading();
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const startTime = Date.now();
    const endTime = startTime + duration;

    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min((elapsed / duration) * 100, 95); // Stop at 95% to show completion when done

      updateProgress(progress);

      if (currentTime >= endTime) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 50);
  }, [startLoading, updateProgress]);

  const completeLoading = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    updateProgress(100);
    
    // Stop loading after a short delay to show completion
    setTimeout(() => {
      stopLoading();
    }, 200);
  }, [updateProgress, stopLoading]);

  const stopLoadingImmediately = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopLoading();
  }, [stopLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    startLoadingWithProgress,
    completeLoading,
    stopLoadingImmediately,
    updateProgress,
  };
}; 