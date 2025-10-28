import { useTranslation } from "react-i18next";

const Tagline = () => {
    const { t } = useTranslation("about");

    const tagline = t("aboutPage.tagline", { returnObjects: true }) as {
        pretext: string;
        quote: string;
        acronym: string;
    };

    return (
        <section className="mt-10 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-28 bg-zinc-950 text-white p-8 text-center">
            <div className="flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 mt-0 md:mt-4 xl:mt-20">
                <blockquote className="text-2xl md:text-2xl lg:text-3xl xl:text-4xl mb-2 bg-gradient-to-b from-zinc-100 via-zinc-300 to-red-300 bg-clip-text text-transparent italic">
                    &apos;{tagline.quote}&quot;
                </blockquote>
            </div>
        </section>
    );
};

export default Tagline;
