import { useTranslation } from "react-i18next";

const Grow = () => {
  const { t } = useTranslation("home");

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-20">
        <div className="w-full lg:w-1/2 text-start">
          <h1 className="roboto-medium text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-4xl mx-auto uppercase text-zinc-800">
            {t("homePage.growSection.headline")}{" "}
            <span className="roboto-medium text-red-900 font-extrabold">
              {t("homePage.growSection.headlineSpan")}
            </span>
          </h1>
          <p className="text-2xl text-zinc-600 lg:max-w-2xl lg:mx-auto">
            {t("homePage.growSection.description")}
          </p>
        </div>

        <div className="relative w-full lg:w-1/2">
          <div className="absolute inset-0 z-10 bg-red-950 translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4 rounded-lg" />

          <img
            className="relative z-20 w-full h-full object-cover rounded-lg"
            src="/images/office-1.jpg"
            alt={t("homePage.growSection.imageAlt")}
          />
        </div>
      </div>
    </div>
  );
};

export default Grow;
