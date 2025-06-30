import { useState } from 'react';
import useJobs from '../hooks/useJobs';
import JobList from '../components/JobList';
import PaginationControl from '../components/PaginationControl';
import CityDropdown from '../components/ui/city-dropwdown';
import { useTranslation } from "react-i18next";
import { Helmet } from 'react-helmet-async';
import JobFilterModal from '../components/ui/JobFilterModal';
import useFilterStore from '../store/filterStore';

const JobListing = () => {
  const { t, ready } = useTranslation();
  const { filters, setFilters } = useFilterStore();
  
  // Ждем загрузки переводов
  const defaultCity = ready ? t('choose_city_dashboard') : 'Выбрать город';
  const defaultTitle = ready ? t('latest_jobs') : 'Последние вакансии';

  const { jobs, loading } = useJobs();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState({ value: null, label: defaultCity });
  const jobsPerPage = 10;
  const [filterOpen, setFilterOpen] = useState(false);

  // Фильтрация вакансий
  const filteredJobs = jobs.filter(job => {
    const cityMatch = !selectedCity.value || job.cityId === selectedCity.value;
    const salaryMatch = !filters.salary || (job.salary && Number(job.salary) >= filters.salary);
    const categoryMatch = !filters.categoryId || job.categoryId === Number(filters.categoryId);
    const shuttleMatch = !filters.shuttleOnly || job.shuttle === true;
    const mealsMatch = !filters.mealsOnly || job.meals === true;
    return cityMatch && salaryMatch && categoryMatch && shuttleMatch && mealsMatch;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

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
            className="d-flex align-items-center justify-content-center border border-primary rounded px-4 board-btn"
            style={{
              height: 40,
              background: '#fff',
              color: '#1976d2',
              fontWeight: 500,
              fontSize: 16,
              boxShadow: '0 1px 4px rgba(25, 118, 210, 0.06)',
              transition: 'box-shadow 0.2s',
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
      {filteredJobs.length > 0 && (
        <PaginationControl currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
};

export { JobListing };
