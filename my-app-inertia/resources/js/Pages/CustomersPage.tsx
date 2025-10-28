import Hero from "../Components/ui/Hero";
import { useTranslation } from "react-i18next";
import { customerLogos } from "../data/customer";
import { Head } from "@inertiajs/react";

const CustomerPage = () => {
    const { t } = useTranslation(["home", "common"]);

    return (
        <>
            <Head title={t("common:nav.customers")} />
            <div className="min-h-screen bg-zinc-50">
                <Hero
                    imageSrc="/images/office-5.jpg"
                    title={t("homePage.customer.headline")}
                    description={t("homePage.customer.description")}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 py-16 md:py-24">
                    <div className="text-left lg:text-center mb-12 md:mb-16">
                        <h1 className="roboto-medium text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-4xl mx-auto uppercase text-zinc-800">
                            {t("homePage.customer.headline")}{" "}
                            <span className="roboto-medium text-red-900 font-extrabold">
                                {t("homePage.customer.headlineSpan")}
                            </span>
                        </h1>
                        <p className="text-2xl text-zinc-600 lg:max-w-2xl lg:mx-auto">
                            {t("homePage.customer.description")}{" "}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {customerLogos.map((logo) => (
                            <div
                                key={logo.name}
                                className="flex items-center justify-center transition-all duration-300 filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
                            >
                                <img
                                    src={logo.logoUrl}
                                    alt={logo.name}
                                    className="h-28 md:h-40 w-auto object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomerPage;
