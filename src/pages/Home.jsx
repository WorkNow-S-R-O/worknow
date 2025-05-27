import { Navbar } from "../components/index";
import { Footer } from "../components/index";
import { JobListing } from "../components/index";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Работа в Израиле — Поиск работы, вакансии, трудоустройство | WorkNow</title>
        <meta name="description" content="Поиск работы в Израиле для русскоговорящих и всех желающих. Свежие вакансии в Ашкелоне, Тель-Авиве, Иерусалиме и других городах Израиля. Работа для мужчин, женщин, студентов, без знания иврита." />
        <meta name="keywords" content="работа в Израиле, вакансии Израиль, поиск работы Израиль, работа Ашкелон, работа Тель-Авив, работа для русскоговорящих, трудоустройство Израиль, свежие вакансии Израиль" />
        <meta property="og:title" content="Работа в Израиле — Поиск работы, вакансии, трудоустройство | WorkNow" />
        <meta property="og:description" content="Поиск работы в Израиле для русскоговорящих и всех желающих. Свежие вакансии в Ашкелоне, Тель-Авиве, Иерусалиме и других городах Израиля." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://worknowjob.com/" />
        <meta property="og:image" content="https://worknowjob.com/images/logo.svg" />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:locale:alternate" content="he_IL" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Работа в Израиле — Поиск работы, вакансии, трудоустройство | WorkNow" />
        <meta name="twitter:description" content="Поиск работы в Израиле для русскоговорящих и всех желающих. Свежие вакансии в Ашкелоне, Тель-Авиве, Иерусалиме и других городах Израиля." />
        <meta name="twitter:image" content="https://worknowjob.com/images/logo.svg" />
        <meta name="geo.region" content="IL" />
        <meta name="geo.placename" content="Israel" />
        <meta name="geo.position" content="31.0461;34.8516" />
        <link rel="alternate" href="https://worknowjob.com/" hreflang="ru" />
        <link rel="alternate" href="https://worknowjob.com/he" hreflang="he" />
        <link rel="alternate" href="https://worknowjob.com/en" hreflang="en" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "WorkNow",
              "url": "https://worknowjob.com/",
              "logo": "https://worknowjob.com/images/logo.svg",
              "description": "Поиск работы в Израиле для русскоговорящих и всех желающих. Свежие вакансии в Ашкелоне, Тель-Авиве, Иерусалиме и других городах Израиля.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IL"
              },
              "sameAs": [
                "https://t.me/worknowjob",
                "https://www.facebook.com/worknowjob"
              ]
            }
          `}
        </script>
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <JobListing />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
