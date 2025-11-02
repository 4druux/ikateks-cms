import { useTranslation } from "react-i18next";

const PrivacySection: React.FC<{
    title: string;
    children: React.ReactNode;
}> = ({ title, children }) => (
    <div className="pb-4 md:pb-6">
        <h2 className="text-lg md:text-xl font-medium text-zinc-800 mb-1">
            {title}
        </h2>
        <div className="text-sm md:text-md space-y-2 text-zinc-700 leading-relaxed pl-6">
            {children}
        </div>
    </div>
);

const PrivacyPolicyContent = () => {
    const { t } = useTranslation("privacy");
    const companyName = "PT. Ikateks Citra Persada";
    const companyEmail = "admin@ikateks.com";
    const siteUrl = "ikateks.com";

    return (
        <section className="mt-10 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-left lg:text-center mb-6 md:mb-12">
                    <h1 className="roboto-medium text-2xl md:text-3xl lg:text-4xl font-extrabold max-w-4xl mx-auto uppercase text-zinc-800 md:mb-1">
                        {t("privacyPage.content.headline")}{" "}
                        <span className="roboto-medium text-red-900 font-extrabold">
                            {t("privacyPage.content.headline-span")}
                        </span>
                    </h1>

                    <p className="text-lg text-zinc-600 lg:max-w-2xl lg:mx-auto">
                        {t("privacyPage.content.effectiveDate")}
                    </p>
                </div>

                <PrivacySection title={t("privacyPage.content.section1.title")}>
                    <p>
                        {t("privacyPage.content.section1.p1", {
                            companyName,
                            siteUrl,
                        })}
                    </p>
                    <p>{t("privacyPage.content.section1.p2")}</p>
                    <p>{t("privacyPage.content.section1.p3")}</p>
                </PrivacySection>

                <PrivacySection title={t("privacyPage.content.section2.title")}>
                    <p>{t("privacyPage.content.section2.p1")}</p>
                    <h3 className="text-sm md:text-md font-medium roboto-medium">
                        {t("privacyPage.content.section2.subheadingA")}
                    </h3>
                    <p>{t("privacyPage.content.section2.p2")}</p>
                    <h3 className="text-sm md:text-md font-medium roboto-medium">
                        {t("privacyPage.content.section2.subheadingB")}
                    </h3>
                    <p>{t("privacyPage.content.section2.p3")}</p>
                </PrivacySection>

                <PrivacySection title={t("privacyPage.content.section3.title")}>
                    <p>{t("privacyPage.content.section3.p1")}</p>
                    <ul className="list-disc list-outside pl-6 space-y-2">
                        {(
                            t("privacyPage.content.section3.list", {
                                returnObjects: true,
                            }) as string[]
                        ).map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </PrivacySection>

                <PrivacySection title={t("privacyPage.content.section4.title")}>
                    <p>{t("privacyPage.content.section4.p1")}</p>
                    <ul className="list-disc list-outside pl-6 space-y-2">
                        {(
                            t("privacyPage.content.section4.list", {
                                returnObjects: true,
                            }) as string[]
                        ).map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </PrivacySection>

                <PrivacySection title={t("privacyPage.content.section5.title")}>
                    <p>{t("privacyPage.content.section5.p1")}</p>
                    <p>{t("privacyPage.content.section5.p2")}</p>
                    <p>{t("privacyPage.content.section5.p3")}</p>
                </PrivacySection>

                <PrivacySection title={t("privacyPage.content.section6.title")}>
                    <p>{t("privacyPage.content.section6.p1")}</p>
                    <p>{t("privacyPage.content.section6.p2")}</p>
                    <p>{t("privacyPage.content.section6.p3")}</p>
                </PrivacySection>

                <PrivacySection title={t("privacyPage.content.section7.title")}>
                    <p>{t("privacyPage.content.section7.p1")}</p>
                    <p>{t("privacyPage.content.section7.p2")}</p>
                </PrivacySection>

                <PrivacySection title={t("privacyPage.content.section8.title")}>
                    <p>{t("privacyPage.content.section8.p1")}</p>
                </PrivacySection>

                <PrivacySection title={t("privacyPage.content.section9.title")}>
                    <p>
                        {t("privacyPage.content.section9.contactText")}{" "}
                        <a
                            href={`mailto:${companyEmail}`}
                            className="text-blue-700 hover:underline font-medium"
                        >
                            {companyEmail}
                        </a>
                        .
                    </p>
                </PrivacySection>
            </div>
        </section>
    );
};

export default PrivacyPolicyContent;
