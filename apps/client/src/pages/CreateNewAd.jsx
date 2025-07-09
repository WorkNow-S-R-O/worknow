import { JobForm } from "../components/index";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

function CreateNewAd() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("create_new_advertisement_tab")}</title>
        <meta name="description" content="Create new advertisement | Worknow" />
      </Helmet>
      <JobForm />
    </>
  );
}

export default CreateNewAd;
