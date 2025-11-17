import { useTranslation } from "react-i18next";
import { Head } from "@inertiajs/react";
import Hero from "@/Components/ui/users/Hero";
import useSWR from "swr";
import { Customer, fetcher, PageHero } from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";

const CustomerPage = () => {
    const { t } = useTranslation(["home", "common"]);

    const {
        data: heroData,
        error: heroError,
        isLoading: isLoadingHero,
    } = useSWR<PageHero>("/api/hero?page=customers", fetcher);

    const {
        data: customers,
        error,
        isLoading,
    } = useSWR<Customer[]>("/api/customers", fetcher);

    const TotalError = heroError || error;
    const TotalLoading = isLoadingHero || isLoading;

    return (
        <>
            <Head title={t("common:nav.customers")} />
            <div className="min-h-screen bg-zinc-50">
                <Hero
                    heroData={heroData}
                    isLoading={isLoadingHero}
                    fallbackImage="https://placehold.co/800x600?text=Placeholder+4:3&font=roboto"
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
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

                    {TotalLoading && (
                        <div className="flex justify-center items-center h-40">
                            <DotLoader />
                        </div>
                    )}

                    {TotalError && (
                        <p className="text-center text-red-600">
                            {t("customers:error")}
                        </p>
                    )}

                    {!TotalLoading &&
                        !TotalError &&
                        customers &&
                        customers.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                                {customers.map((customer) => (
                                    <div
                                        key={customer.id}
                                        className="flex items-center justify-center transition-all duration-300 filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 p-4"
                                    >
                                        <img
                                            src={
                                                customer.image_url ??
                                                "/images/placeholder.jpg"
                                            }
                                            alt={`Customer ${customer.id}`}
                                            className="h-28 md:h-40 w-auto object-contain"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "/images/placeholder.jpg";
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                    {!TotalLoading &&
                        !TotalError &&
                        (!customers || customers.length === 0) && (
                            <p className="text-center text-zinc-600">
                                {t("customers:empty")}
                            </p>
                        )}
                </div>
            </div>
        </>
    );
};

export default CustomerPage;
