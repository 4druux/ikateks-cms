import Lenis from "lenis";
import Hero from "../Components/ui/Hero";
import Principals from "../Components/principals/Principals";
import CallToAction from "../Components/ui/CallToAction";
import { useTranslation } from "react-i18next";
import { Head } from "@inertiajs/react";

interface PrincipalsProps {
    lenis: Lenis | null;
}

const PrincipalsPage = ({ lenis }: PrincipalsProps) => {
    const { t } = useTranslation(["principals", "common"]);
    return (
        <>
            <Head title={t("common:nav.principals")} />

            <div className="min-h-screen bg-zinc-50">
                <Hero
                    imageSrc="/images/office-4.jpg"
                    title={t("principalsPage.hero.title")}
                    description={t("principalsPage.hero.description")}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 mt-10 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-28">
                    <Principals lenis={lenis} />
                </div>

                <CallToAction
                    title={t("principalsPage.cta.title")}
                    linkText={t("principalsPage.cta.linkText")}
                />
            </div>
        </>
    );
};

export default PrincipalsPage;
