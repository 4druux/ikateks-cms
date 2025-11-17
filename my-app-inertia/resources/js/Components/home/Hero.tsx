import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHero } from "@/Utils/api";

interface HeroProps {
    onScrollDown: () => void;
    heroData?: PageHero;
    isLoading: boolean;
}

const Hero = ({ onScrollDown, heroData, isLoading }: HeroProps) => {
    const { t, i18n } = useTranslation("home");

    const title = heroData
        ? i18n.language === "id"
            ? heroData.title_id
            : heroData.title
        : t("homePage.hero.title");
    const subtitle = heroData
        ? i18n.language === "id"
            ? heroData.subtitle_id
            : heroData.subtitle
        : t("homePage.hero.companyName");
    const description = heroData
        ? i18n.language === "id"
            ? heroData.description_id
            : heroData.description
        : t("homePage.hero.description");

    const mediaType = isLoading ? "loading" : heroData?.media_type || "video";
    const mediaUrl = heroData?.media_url || "/video/hero.mp4";

    return (
        <section className="relative h-[100dvh] overflow-hidden text-white bg-black">
            {!isLoading && mediaType === "video" && (
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    src={mediaUrl}
                    key={mediaUrl}
                >
                    Your browser does not support the video tag.
                </video>
            )}
            {!isLoading && mediaType === "image" && (
                <img
                    src={mediaUrl}
                    alt="Hero background"
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                />
            )}

            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-t from-transparent via-transparent to-black/70 z-10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>

            <div className="relative z-20 flex flex-col items-start justify-center h-full px-4 sm:px-6 lg:px-8 xl:px-16">
                <div className="text-left max-w-4xl text-zinc-50">
                    <h1 className="roboto-medium text-5xl md:text-8xl font-extrabold mb-2">
                        {title}
                        <span className="text-red-700">.</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-2">{subtitle}</p>
                    <p className="text-md md:text-xl mb-6 leading-relaxed text-zinc-200">
                        {description}
                    </p>
                </div>
            </div>

            <button
                onClick={onScrollDown}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
                aria-label="Scroll to next section"
            >
                <ChevronDown className="w-10 h-10 text-white animate-bounce" />
            </button>
        </section>
    );
};

export default Hero;
