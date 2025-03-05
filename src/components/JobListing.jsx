import { useState} from 'react';
import useJobs from '../hooks/useJobs';
import JobList from '../components/JobList';
import PaginationControl from '../components/PaginationControl';
import CityDropdown from '../components/ui/city-dropwdown';
import { useTranslation } from "react-i18next";
import { Helmet } from 'react-helmet-async';

const JobListing = () => {
  const { t } = useTranslation();
  const { jobs, loading } = useJobs();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState(t('choose_city_dashboard'));
  const jobsPerPage = 10;

  // Фильтрация вакансий по городу
  const filteredJobs = selectedCity === t('choose_city_dashboard') 
    ? jobs 
    : jobs.filter((job) => job.city?.name.toLowerCase() === selectedCity.toLowerCase());

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  // Генерация SEO-friendly заголовка
  const pageTitle = selectedCity !== t('choose_city_dashboard')
    ? `${t('jobs_in')} ${selectedCity} - Worknow`
    : `${t('latest_jobs')} | Worknow`;

  // Генерация динамического описания страницы
  const pageDescription = selectedCity !== t('choose_city_dashboard')
    ? `${t('find_jobs_in')} ${selectedCity}. ${t('new_vacancies_from_employers')}.`
    : `${t('job_search_platform')} - ${t('find_latest_jobs')}.`;

  // Формирование динамического URL для SEO
  const pageUrl = selectedCity !== t('choose_city_dashboard')
    ? `https://worknowjob.com/jobs/${selectedCity.toLowerCase()}`
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
        <meta property="og:image" content="https://worknowjob.com/images/preview.jpg" />
        <meta name="robots" content="index, follow" />
        
        {/* Schema.org разметка (JobPosting) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            "title": selectedCity !== t('choose_city_dashboard') ? `Работа в ${selectedCity}` : "Работа в Израиле",
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
                "addressLocality": selectedCity !== t('choose_city_dashboard') ? selectedCity : "Израиль",
                "addressCountry": "IL"
              }
            }
          })}
        </script>
      </Helmet>

      {/* Фильтр по городам */}
      <CityDropdown selectedCity={selectedCity} onCitySelect={setSelectedCity} />

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
