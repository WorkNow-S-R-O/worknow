import { Navbar } from "../components/index";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();
  const pass = 'TYNLETSPLAY12'

  return (
    <>
      <Helmet>
        <title>{t("jobsworknow")}</title>
        <meta name="description" content="Jobs | Worknow" />
      </Helmet>
      <Navbar />
    </>
  );
}

export default Home;
