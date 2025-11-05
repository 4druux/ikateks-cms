import React from "react";
import { useTranslation } from "react-i18next";
import { AdvantageItem } from "@/Utils/api";
import InfoCard from "@/Components/ui/InfoCard";

interface CompanyAdvantageProps {
    items: AdvantageItem[];
}

const CompanyAdvantage: React.FC<CompanyAdvantageProps> = ({ items }) => {
    const { t, i18n } = useTranslation("about");
    const lang = i18n.language;

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
                {items.map((item) => {
                    const title = lang === "id" ? item.title_id : item.title;
                    const description =
                        lang === "id" ? item.description_id : item.description;

                    return (
                        <InfoCard
                            key={item.id}
                            iconName={item.icon_name}
                            title={title}
                            description={description}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default CompanyAdvantage;
