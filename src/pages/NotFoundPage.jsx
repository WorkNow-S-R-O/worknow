import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <img
        className="w-full md:w-1/3"
        src="./public/images/404.jpg"
        alt="error"
      />
      <div className="btn btn-primary mt-4 md:mt-6 text-sm md:text-lg">
        <Link to="/" className="text-white no-underline">
          <h1 className="md:text-5xl text-sm ">{t("backtohome")}</h1>
        </Link>
      </div>
    </div>
  );
}
