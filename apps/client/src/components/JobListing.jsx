import { useState } from 'react';
import useJobs from '../hooks/useJobs';
import JobList from './JobList';
import PaginationControl from './PaginationControl';
import CityDropdown from './ui/city-dropwdown';
import { useTranslation } from "react-i18next";
import { Helmet } from 'react-helmet-async';
import JobFilterModal from './ui/JobFilterModal';
import useFilterStore from '../store/filterStore';

const JobListing = () => {
  const { t, ready } = useTranslation();
  const { filters, setFilters } = useFilterStore();
  
  // Ждем загрузки переводов
  const defaultCity = ready ? t('choose_city_dashboard') : 'Выбрать город';
  const defaultTitle = ready ? t('latest_jobs') : 'Последние вакансии';

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState({ value: null, label: defaultCity });
  const [filterOpen, setFilterOpen] = useState(false);

  // Combine filters with city selection
  const combinedFilters = {
    ...filters,
    city: selectedCity.value
  };
  
  const { jobs, loading, pagination } = useJobs(currentPage, combinedFilters);

  // Use server-side pagination if available, otherwise fall back to client-side
  const totalPages = pagination ? pagination.pages : Math.ceil(jobs.length / 10);
  const currentJobs = jobs; // Jobs are already paginated from server

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Генерация SEO-friendly заголовка
  const pageTitle = selectedCity.value
    ? `${t('jobs_in', { city: selectedCity.label })} - WorkNow`
    : `${defaultTitle} | WorkNow`;

  // Генерация динамического описания страницы
  const pageDescription = selectedCity.value
    ? `${t('find_jobs_in', { city: selectedCity.label })}. ${t('new_vacancies_from_employers')}.`
    : `${t('job_search_platform')} - ${t('find_latest_jobs')}.`;

  // Формирование динамического URL для SEO
  const pageUrl = selectedCity.value
    ? `https://worknowjob.com/jobs/${selectedCity.label.toLowerCase()}`
    : `https://worknowjob.com/jobs`;

  return (
    <div className="d-flex flex-column align-items-center mt-40 min-h-screen">
      {/* SEO-мета-теги */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://worknowjob.com/images/logo.svg" />
        <meta name="robots" content="index, follow" />
        
        {/* Schema.org разметка (JobPosting) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            "title": selectedCity.value ? `Работа в ${selectedCity.label}` : "Работа в Израиле",
            "description": pageDescription,
            "datePosted": new Date().toISOString(),
            "employmentType": "Full-time",
            "hiringOrganization": {
              "@type": "Organization",
              "name": "Worknow",
              "sameAs": "https://worknowjob.com"
            },
            "jobLocation": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": selectedCity.value ? selectedCity.label : "Израиль",
                "addressCountry": "IL"
              }
            }
          })}
        </script>
      </Helmet>

      {/* Фильтр по городам */}
      <div className="board-controls-wrapper">
        <div className="d-flex align-items-center mb-3 gap-2 board-controls-scale">
          <button
            className="btn btn-outline-primary d-flex align-items-center justify-content-center board-btn"
            style={{
              height: 40,
              fontWeight: 500,
              fontSize: 16,
              gap: 8
            }}
            onClick={() => setFilterOpen(true)}
          >
            <i className="bi bi-gear me-2" style={{ fontSize: 20 }}></i>
            {t('board_settings')}
          </button>
          <div style={{ height: 40, display: 'flex', alignItems: 'center' }}>
            <CityDropdown
              selectedCity={selectedCity}
              onCitySelect={setSelectedCity}
              dropdownStyle={{
                height: 40,
                minWidth: 180,
                fontSize: 16,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 8
              }}
              buttonClassName="city-dropdown-btn"
            />
          </div>
        </div>
      </div>
      <JobFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={setFilters}
        currentFilters={filters}
      />

      {/* Список вакансий */}
      <JobList jobs={currentJobs} loading={loading} />

      {/* Пагинация */}
      {jobs.length > 0 && (
        <PaginationControl currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
};

export { JobListing };
