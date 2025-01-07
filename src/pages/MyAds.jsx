import { Navbar } from "../components/index";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/index";

function MyAds() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("myads")}</title>
        <meta name="description" content="My advertisements | Worknow" />
      </Helmet>
      <Navbar />
      <Button />\
    </>
  );
}

export default MyAds;
