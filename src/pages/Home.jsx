import { Navbar } from "../components/index";
import { Footer } from "../components/index";
import { JobListing } from "../components/index";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("jobsworknow")}</title>
        <meta name="description" content="Jobs | Worknow" />
      </Helmet>
      <Navbar />
      <JobListing />
      <Footer />
    </>
  );
}

export default Home;
