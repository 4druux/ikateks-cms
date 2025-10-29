import { useTranslation } from "react-i18next";
import { Head } from "@inertiajs/react";
import Hero from "@/Components/ui/users/Hero";
import PrivacyPolicyContent from "@/Components/privacy/PrivacyPolicyContent";
import Tagline from "@/Components/about/Tagline";

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
