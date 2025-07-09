import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/button";

function MyAds() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("myads")}</title>
        <meta name="description" content="My advertisements | WorkNow" />
      </Helmet>
      <Button />
    </>
  );
}

export default MyAds;
