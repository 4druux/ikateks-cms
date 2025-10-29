import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { Customer as CustomerType, fetcher } from "@/Utils/api";

const Customer = () => {
    const { t } = useTranslation("home");

    const {
        data: customers,
        error,
        isLoading,
    } = useSWR<CustomerType[]>("/api/customers", fetcher);

    const logosToRender =
        customers && customers.length > 0 ? [...customers, ...customers] : [];

    if (isLoading) {
        return (
            <section>
                <div className="text-left lg:text-center">
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
                <div className="w-full h-40 flex items-center justify-center text-zinc-500 mt-8 md:mt-12">
                    Loading logos...
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section>
                <div className="text-left lg:text-center">
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
                <div className="w-full h-40 flex items-center justify-center text-red-600 mt-8 md:mt-12">
                    Failed to load customer logos.
                </div>
            </section>
        );
    }

    if (!customers || customers.length === 0) {
        return (
            <section>
                <div className="text-left lg:text-center">
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
                <div className="w-full h-40 flex items-center justify-center text-zinc-500 mt-8 md:mt-12">
                    No customer logos available.
                </div>
            </section>
        );
    }

    return (
        <>
            <style>
                {`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
                `}
            </style>

            <section>
                <div className="text-left lg:text-center">
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

                <div
                    className="w-full inline-flex flex-nowrap overflow-hidden mt-8 md:mt-12
                    [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]
                    "
                >
                    <ul
                        className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none
                        animate-scroll hover:[animation-play-state:paused]
                        "
                    >
                        {logosToRender.map((logo, index) => (
                            <li
                                key={`${logo.id}-${index}`}
                                className="flex-shrink-0"
                            >
                                <img
                                    src={
                                        logo.image_url ??
                                        "/images/placeholder.jpg"
                                    }
                                    alt={`Customer ${logo.id}`}
                                    className="h-28 md:h-40 w-auto object-contain filter grayscale opacity-60
                                    transition-all duration-300 hover:grayscale-0 hover:opacity-100
                                    "
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "/images/placeholder.jpg";
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    );
};

export default Customer;
