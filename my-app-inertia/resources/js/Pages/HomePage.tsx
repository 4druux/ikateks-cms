import { useRef } from "react";
import Hero from "../Components/home/Hero";
import News from "../Components/home/News";
import About from "../Components/home/About";
import ProductCategories from "../Components/products/ProductCategories";
import Grow from "../Components/home/Grow";
import CallToAction from "../Components/ui/CallToAction";
import { useTranslation } from "react-i18next";
import Principals from "../Components/principals/Principals";
import Customer from "../Components/home/Customer";
import { useLenis } from "@/Context/LenisContext";
import { Head } from "@inertiajs/react";

export default function HomePage() {
    const { t } = useTranslation("home");
    const newsSectionRef = useRef<HTMLElement>(null!);
    const lenis = useLenis();

    const handleScrollDown = () => {
        if (newsSectionRef.current) {
            lenis?.scrollTo(newsSectionRef.current, {
                duration: 1.5,
                easing: (t: number) =>
                    Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
        }
    };

    return (
        <>
            <Head title="PT Ikateks" />
            <div className="min-h-screen bg-zinc-50">
                <Hero onScrollDown={handleScrollDown} />
                <News lenis={lenis} newsSectionRef={newsSectionRef} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 mt-10 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-28 space-y-16 md:space-y-20 lg:space-y-24 xl:space-y-32 2xl:space-y-40">
                    <About />
                    <ProductCategories
                        headlineKey="product.headline"
                        headlineSpanKey="product.headline-span"
                        descriptionKey="product.description"
                        limit={6}
                        showViewAllButton={true}
                    />
                    <Grow />
                    <Principals
                        lenis={lenis}
                        limit={6}
                        showViewAllButton={true}
                    />
                    <Customer />
                </div>

                <CallToAction
                    title={t("homePage.cta.title")}
                    linkText={t("homePage.cta.linkText")}
                />
            </div>
        </>
    );
}
