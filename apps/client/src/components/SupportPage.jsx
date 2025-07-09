import { useTranslation } from "react-i18next";

const SupportPage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Основной контент */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            {t("email_support")}
          </h2>
          <a
            href="mailto:worknow.notifications@gmail.com"
            className="text-blue-600 text-lg font-medium hover:underline"
          >
            worknow.notifications@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
