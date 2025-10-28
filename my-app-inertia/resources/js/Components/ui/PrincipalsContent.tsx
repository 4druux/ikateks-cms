import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type TranslatedPrincipalsItem } from "../../data/principals";

interface PrincipalsContentProps {
    principals: TranslatedPrincipalsItem[];
    onPrincipalsClick: (item: TranslatedPrincipalsItem) => void;
}

const PrincipalsContent = ({
    principals,
    onPrincipalsClick,
}: PrincipalsContentProps) => {
    const { t } = useTranslation("principals");

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 xl:gap-8">
                {principals.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.id}
                            onClick={() => onPrincipalsClick(item)}
                            className="group relative cursor-pointer"
                        >
                            <div
                                className="absolute inset-0 z-0 rounded-xl bg-red-900 opacity-0 transition-all duration-300 ease-in-out group-hover:rotate-3 group-hover:opacity-100"
                                style={{
                                    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))",
                                }}
                            />
                            <div className="relative z-10 flex h-full flex-col rounded-xl bg-white p-6 shadow-sm transition-shadow duration-300">
                                <div className="mb-4 flex-shrink-0 rounded-lg bg-red-50 p-3 w-fit">
                                    <Icon
                                        className="h-8 w-8 text-red-900"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-800">
                                    {item.title}
                                </h3>
                                <p className="mt-2 flex-grow text-zinc-600 line-clamp-3">
                                    {item.description}
                                </p>
                                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
                                    <span className="text-sm font-semibold text-red-900">
                                        {t("principals.learnMore")}
                                    </span>
                                    <ArrowRight className="h-5 w-5 text-zinc-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-red-900" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default PrincipalsContent;
