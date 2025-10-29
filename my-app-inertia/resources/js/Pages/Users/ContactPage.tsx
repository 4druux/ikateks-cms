import Hero from "@/Components/ui/users/Hero";
import Tagline from "@/Components/about/Tagline";
import ContactContent from "@/Components/contact/ContactContent";
import { useTranslation } from "react-i18next";
import { Head } from "@inertiajs/react";

const ContactPage = () => {
    const { t } = useTranslation(["contact", "common"]);

    return (
        <>
            <Head title={t("common:nav.contact")} />

            <div className="min-h-screen bg-zinc-50">
                <Hero
                    imageSrc="/images/contact.jpg"
                    title={t("contactPage.hero.title")}
                    description={t("contactPage.hero.description")}
                />
                <ContactContent />
                <Tagline />
            </div>
        </>
    );
};

export default ContactPage;
