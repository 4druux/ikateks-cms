import { PageHero } from "@/Utils/api";
import { useTranslation } from "react-i18next";

interface HeroProps {
    heroData?: PageHero;
    isLoading: boolean;
    fallbackImage: string;
}

const Hero = ({ heroData, isLoading, fallbackImage }: HeroProps) => {
    const { i18n } = useTranslation(["about", "common"]);

    const title = heroData
        ? i18n.language === "id"
            ? heroData.title_id
            : heroData.title
        : "Loading...";

    const description = heroData
        ? i18n.language === "id"
            ? heroData.description_id
            : heroData.description
        : "Please wait...";

    const mediaType = isLoading ? "loading" : heroData?.media_type || "image";
    const mediaUrl = heroData?.media_url || fallbackImage;

    return (
        <section className="relative h-[60dvh] overflow-hidden text-white bg-black">
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
            {(mediaType === "image" || isLoading) && (
                <img
                    className={`absolute top-0 left-0 w-full h-full object-cover z-0 ${
                        isLoading ? "opacity-50" : ""
                    }`}
                    src={isLoading ? fallbackImage : mediaUrl}
                    alt={`${title} hero background`}
                />
            )}

            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-t from-transparent via-transparent to-black/70 z-10" />
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />

            <div className="relative z-20 flex flex-col items-start justify-center h-full px-4 sm:px-6 lg:px-8 xl:px-16">
                <div className="text-left max-w-4xl text-zinc-50">
                    <h1 className="roboto-medium text-5xl md:text-8xl font-extrabold mb-2">
                        {title}
                        <span className="text-red-700">.</span>
                    </h1>
                    <p className="text-lg md:text-xl mb-6 max-w-3xl leading-relaxed text-zinc-200">
                        {description}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Hero;
