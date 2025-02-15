import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <img
        className="w-full md:w-1/3"
        src="/images/404.jpg"
        alt="not-found"
      />
      <p className="md:text-3xl text-sm mt-4">{t("page_not_found")}</p>
      <Link to="/" className="btn btn-primary mt-4 md:mt-6 text-white no-underline">
        <h1 className="md:text-2xl text-sm">{t("backtohome")}</h1>
      </Link>
    </div>
  );
}
