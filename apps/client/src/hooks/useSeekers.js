import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import useLanguageStore from '../store/languageStore';
import { useLoadingProgress } from './useLoadingProgress';

const API_URL = import.meta.env.VITE_API_URL;

const useSeekers = (page = 1, filters = {}, forceRefresh = 0) => {
  const [seekers, setSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const language = useLanguageStore((state) => state.language) || 'ru';
  const { startLoadingWithProgress, completeLoading } = useLoadingProgress();

  // Memoize filters to prevent infinite re-renders
  const memoizedFilters = useMemo(() => filters, [
    filters.city,
    filters.category,
    filters.employment,
    filters.documentType,
    filters.languages,
    filters.gender,
    filters.isDemanded
  ]);

  useEffect(() => {
    console.log('🔄 useSeekers useEffect triggered - page:', page, 'filters:', memoizedFilters, 'forceRefresh:', forceRefresh, 'timestamp:', Date.now());
    
    const loadSeekers = async () => {
      setLoading(true);
      
      // Only show loading progress if it takes more than 500ms
      const loadingTimeout = setTimeout(() => {
        startLoadingWithProgress(1500);
      }, 500);
      
      try {
        // Build query parameters
        const params = new URLSearchParams({
          page: page,
          limit: 10,
          lang: language
        });

        // Add filter parameters if they exist
        if (memoizedFilters.city) params.append('city', memoizedFilters.city);
        if (memoizedFilters.category) params.append('category', memoizedFilters.category);
        if (memoizedFilters.employment) params.append('employment', memoizedFilters.employment);
        if (memoizedFilters.documentType) params.append('documentType', memoizedFilters.documentType);
        if (memoizedFilters.gender) params.append('gender', memoizedFilters.gender);
        if (memoizedFilters.isDemanded !== undefined) params.append('isDemanded', memoizedFilters.isDemanded);
        
        // Handle languages array
        if (memoizedFilters.languages && Array.isArray(memoizedFilters.languages) && memoizedFilters.languages.length > 0) {
          memoizedFilters.languages.forEach(lang => {
            params.append('languages', lang);
          });
        }
        
        console.log('🚀 useSeekers fetching with params:', params.toString());
        console.log('🌐 Full URL:', `${API_URL}/api/seekers?${params.toString()}`);
        const response = await axios.get(`${API_URL}/api/seekers?${params.toString()}`);
      
        console.log('📡 API Response:', response.data);
        
        // Handle API response format with pagination
        if (response.data && response.data.seekers) {
          // New format with pagination
          setSeekers(response.data.seekers);
          setPagination(response.data.pagination);
          console.log(`✅ useSeekers found ${response.data.seekers.length} seekers, total pages: ${response.data.pagination?.totalPages || 1}`);
        } else if (Array.isArray(response.data)) {
          // Old format - just array of seekers
          setSeekers(response.data);
          setPagination(null);
          console.log(`✅ useSeekers found ${response.data.length} seekers (old format)`);
        } else {
          console.error("❌ API вернул неожиданный формат:", response.data);
          setSeekers([]);
          setPagination(null);
        }
        
        clearTimeout(loadingTimeout);
        completeLoading(); // Complete loading when done
      } catch (error) {
        if (!(error?.code === 'ECONNABORTED')) {
          console.error("❌ Ошибка загрузки соискателей:", error);
          setError("Ошибка загрузки соискателей");
        }
        clearTimeout(loadingTimeout);
        completeLoading(); // Complete loading even on error
      } finally {
        setLoading(false);
      }
    };

    loadSeekers();
  }, [language, page, memoizedFilters, forceRefresh]); // Use memoized filters to prevent infinite loops

  console.log('🔄 useSeekers returning:', { seekers: seekers.length, loading, error, pagination, page });
  return { seekers, loading, error, pagination };
};

export default useSeekers; 