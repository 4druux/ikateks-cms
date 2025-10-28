import { companyAdvantage } from "../../data/about";
import { useTranslation } from "react-i18next";

const CompanyAdvantage = () => {
  const { t } = useTranslation("about");

  return (
    <div>
      <div className="text-left lg:text-center mb-6 lg:mb-12">
        <h1 className="roboto-medium text-2xl md:text-3xl font-extrabold max-w-4xl mx-auto uppercase text-zinc-800">
          {t("aboutPage.companyAdvantage.headline")}{" "}
          <span className="roboto-medium text-red-900 font-extrabold">
            {t("aboutPage.companyAdvantage.headline-span")}
          </span>
        </h1>
        <p className="text-lg text-zinc-600 lg:max-w-2xl lg:mx-auto">
          {t("aboutPage.companyAdvantage.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        {companyAdvantage.map((item) => {
          const IconComponent = item.icon;
          const translation = t(`aboutPage.companyAdvantage.items.${item.i18nKey}`, {
            returnObjects: true,
          }) as { title: string; description: string };

          return (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="mb-4 flex-shrink-0 rounded-lg bg-red-50 p-3 w-fit">
                <IconComponent
                  className="h-8 w-8 text-red-900"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-xl font-bold text-zinc-800">
                {translation.title}
              </h3>
              <p className="mt-2 flex-grow text-zinc-600">
                {translation.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyAdvantage;
