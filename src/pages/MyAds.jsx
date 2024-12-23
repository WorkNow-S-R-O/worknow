import { Navbar } from "../components/index";
import { JobForm } from "../components/index";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

function MyAds() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("myads")}</title>
        <meta name="description" content="Jobs | Worknow" />
      </Helmet>
      <Navbar />
      <JobForm />
    </>
  );
}

export default MyAds;
