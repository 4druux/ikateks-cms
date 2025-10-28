import Lenis from "lenis";
import Hero from "../Components/ui/Hero";
import CallToAction from "../Components/ui/CallToAction";
import News from "../Components/news/News";
import { useTranslation } from "react-i18next";
import { Head } from "@inertiajs/react";

const NewsPage = ({ lenis }: { lenis: Lenis | null }) => {
    const { t } = useTranslation(["news", "common"]);

    return (
        <>
            <Head title={t("common:nav.news")} />

            <div className="min-h-screen">
                <Hero
                    imageSrc="/images/office-1.jpg"
                    title={t("newsPage.hero.title")}
                    description={t("newsPage.hero.description")}
                />

                <News lenis={lenis} />

                <CallToAction
                    title={t("newsPage.cta.title")}
                    linkText={t("newsPage.cta.linkText")}
                />
            </div>
        </>
    );
};

export default NewsPage;
