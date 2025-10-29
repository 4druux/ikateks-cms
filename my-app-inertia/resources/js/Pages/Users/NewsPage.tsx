import Lenis from "lenis";
import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import Hero from "@/Components/ui/users/Hero";
import CallToAction from "@/Components/ui/users/CallToAction";
import News from "@/Components/news/News";

const NewsPage = ({
    lenis,
    initialSlug,
}: {
    lenis: Lenis | null;
    initialSlug?: string;
}) => {
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

                <News lenis={lenis} initialSlug={initialSlug} />

                <CallToAction
                    title={t("newsPage.cta.title")}
                    linkText={t("newsPage.cta.linkText")}
                />
            </div>
        </>
    );
};

export default NewsPage;
