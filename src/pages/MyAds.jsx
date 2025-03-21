import { Navbar } from "../components/index";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/index";
import { Footer } from "../components/index";

function MyAds() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("myads")}</title>
        <meta name="description" content="My advertisements | WorkNow" />
      </Helmet>
      <Navbar />
      <Button />
      <Footer className="" />
    </>
  );
}

export default MyAds;
