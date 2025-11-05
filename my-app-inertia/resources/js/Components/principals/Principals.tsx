import React, { useState, useEffect } from "react";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";
import ModalPrincipals from "@/Components/ui/ModalPrincipals";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import PrincipalsContent from "@/Components/ui/PrincipalsContent";
import Button from "@/Components/common/Button";
import useSWR from "swr";
import { PrincipalItem, fetcher } from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";

interface PrincipalsProps {
    lenis: Lenis | null;
    limit?: number;
    showViewAllButton?: boolean;
}

const Principals: React.FC<PrincipalsProps> = ({
    lenis,
    limit,
    showViewAllButton = false,
}) => {
    const { t } = useTranslation("principals");

    const [selectedPrincipals, setSelectedPrincipals] =
        useState<PrincipalItem | null>(null);
    const isModalOpen = !!selectedPrincipals;

    const {
        data: principalsData,
        error,
        isLoading,
    } = useSWR<PrincipalItem[]>("/api/principals", fetcher);

    const principalsToShow = limit
        ? (principalsData || []).slice(0, limit)
        : principalsData || [];

    const handleOpenModal = (item: PrincipalItem) => {
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
                {isLoading && (
                    <div className="flex justify-center py-10">
                        <DotLoader />
                    </div>
                )}
                {error && (
                    <div className="text-center text-red-600">
                        Failed to load principals.
                    </div>
                )}
                {principalsToShow.length > 0 && (
                    <PrincipalsContent
                        principals={principalsToShow}
                        onPrincipalsClick={handleOpenModal}
                    />
                )}
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
