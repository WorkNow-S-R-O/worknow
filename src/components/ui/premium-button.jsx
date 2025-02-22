import { useTranslation } from "react-i18next";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const PremiumButton = () => {
  const { t } = useTranslation();

  return (
    <Sheet className="z-9999">
      <SheetTrigger asChild>
        <button type="button" className="btn btn-warning">
          <i className="bi bi-gem me-2"></i>
          {t("premium")}
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full">
        <div className="flex-1 overflow-auto">
          <SheetHeader>
            <SheetTitle>{t("premium_title")}</SheetTitle>
            <SheetDescription>
              {t("premium_description")}
            </SheetDescription>
          </SheetHeader>

          {/* Преимущества подписки */}
          <div className="my-4 p-4 bg-primary rounded-lg shadow">
            <h3 className="text-lg font-bold text-white mb-2">{t("premium_benefits_title")}</h3>
            <ul className="list-disc list-inside text-white">
              <li>{t("premium_benefit_1")}</li>
              <li>{t("premium_benefit_3")}</li>
              <li>{t("premium_benefit_5")}</li>
              <li>
                <a
                  href="https://www.facebook.com/groups/763040732570299"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-white"
                >
                  {t("premium_benefit_2")}
                </a>
              </li>
            </ul>
          </div>

          <div className="flex justify-center items-center my-4">
            <img
              src="/images/premium.png"
              alt="premium"
              className=""
            />
          </div>

          <div className="text-center my-4">
            <a
              href="https://foggy-macrame-d24.notion.site/1a281d115acf801eabf3e8a40c9f0a84?pvs=4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {t("how_it_works")}
            </a>
          </div>
        </div>

        {/* Фиксированная кнопка оплаты */}
        <div className="mt-auto">
          <button
            type="button"
            className="btn btn-primary w-full py-3 text-lg"
          >
            {t("purchase")}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PremiumButton;
