import { useState, useEffect } from "react";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";
import {
    principals as staticPrincipalsData,
    type TranslatedPrincipalsItem,
    type StaticPrincipalsItem,
} from "../../data/principals";
import ModalPrincipals from "@/Components/ui/ModalPrincipals";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import PrincipalsContent from "@/Components/ui/PrincipalsContent";
import Button from "@/Components/common/Button";

interface PrincipalssProps {
    lenis: Lenis | null;
    limit?: number;
    showViewAllButton?: boolean;
}

const Principals = ({
    lenis,
    limit,
    showViewAllButton = false,
}: PrincipalssProps) => {
    const { t } = useTranslation("principals");
    const [selectedPrincipals, setSelectedPrincipals] =
        useState<TranslatedPrincipalsItem | null>(null);
    const isModalOpen = !!selectedPrincipals;

    const translatedPrincipalss: TranslatedPrincipalsItem[] =
        staticPrincipalsData.map((item: StaticPrincipalsItem) => {
            const translations = t(`principals.${item.i18nKey}`, {
                returnObjects: true,
            }) as Omit<TranslatedPrincipalsItem, "id" | "icon" | "i18nKey">;

            return {
                ...item,
                ...translations,
            };
        });

    const principalsToShow = limit
        ? translatedPrincipalss.slice(0, limit)
        : translatedPrincipalss;

    const handleOpenModal = (item: TranslatedPrincipalsItem) => {
        setSelectedPrincipals(item);
    };

    const handleCloseModal = () => {
        setSelectedPrincipals(null);
    };

    useEffect(() => {
        if (isModalOpen) {
            lenis?.stop();
            document.body.style.overflow = "hidden";
        } else {
            lenis?.start();
            document.body.style.overflow = "unset";
        }
        return () => {
            lenis?.start();
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen, lenis]);

    return (
        <div>
            <div className="text-left lg:text-center">
                <h1 className="roboto-medium text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-4xl mx-auto uppercase text-zinc-800">
                    {t("principals.headline")}{" "}
                    <span className="roboto-medium text-red-900 font-extrabold">
                        {t("principals.headline-span")}
                    </span>
                </h1>
                <p className="text-2xl text-zinc-600 lg:max-w-2xl lg:mx-auto">
                    {t("principals.description")}
                </p>
            </div>

            <div className="mt-6 md:mt-12">
                <PrincipalsContent
                    principals={principalsToShow}
                    onPrincipalsClick={handleOpenModal}
                />
            </div>

            {showViewAllButton && (
                <div className="text-center mt-12">
                    <Button
                        as="link"
                        href="/principals"
                        variant="outline"
                        iconRight={<ArrowRight className="h-5 w-5" />}
                    >
                        {t("principals.viewAll")}
                    </Button>
                </div>
            )}

            <AnimatePresence>
                {selectedPrincipals && (
                    <ModalPrincipals
                        item={selectedPrincipals}
                        onClose={handleCloseModal}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Principals;
