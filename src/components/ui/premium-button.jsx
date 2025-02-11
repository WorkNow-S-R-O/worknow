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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("premium_title")}</SheetTitle>
          <SheetDescription>
            {t("premium_description")}
          </SheetDescription>
        </SheetHeader>
        {/* Здесь можно добавить контент, например, преимущества премиум-аккаунта */}
      </SheetContent>
    </Sheet>
  );
};

export default PremiumButton;
