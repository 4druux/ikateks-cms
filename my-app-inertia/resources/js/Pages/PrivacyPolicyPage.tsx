import Hero from "../Components/ui/Hero";

import PrivacyPolicyContent from "../Components/privacy/PrivacyPolicyContent";
import { useTranslation } from "react-i18next";
import Tagline from "../Components/about/Tagline";
import { Head } from "@inertiajs/react";

const PrivacyPolicyPage = () => {
    const { t } = useTranslation(["privacy", "common"]);

    return (
        <>
            <Head title={t("common:nav.privacy")} />

            <div className="min-h-screen bg-zinc-50">
                <Hero
                    imageSrc="/images/privacy.jpg"
                    title={t("privacyPage.hero.title")}
                    description={t("privacyPage.hero.description")}
                />

                <PrivacyPolicyContent />

                <Tagline />
            </div>
        </>
    );
};

export default PrivacyPolicyPage;
