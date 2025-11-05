import { useTranslation } from "react-i18next";
import { PrincipalItem } from "@/Utils/api";
import React from "react";
import InfoCard from "./InfoCard";

interface PrincipalsContentProps {
    principals: PrincipalItem[];
    onPrincipalsClick: (item: PrincipalItem) => void;
}

const PrincipalsContent: React.FC<PrincipalsContentProps> = ({
    principals,
    onPrincipalsClick,
}) => {
    const { t, i18n } = useTranslation("principals");
    const lang = i18n.language;
    const learnMoreText = t("principals.learnMore");

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 xl:gap-8">
            {principals.map((item) => {
                const title = lang === "id" ? item.title_id : item.title;
                const description =
                    lang === "id" ? item.description_id : item.description;

                return (
                    <InfoCard
                        key={item.id}
                        iconName={item.icon_name}
                        title={title}
                        description={description}
                        onClick={() => onPrincipalsClick(item)}
                        learnMoreText={learnMoreText}
                    />
                );
            })}
        </div>
    );
};

export default PrincipalsContent;
