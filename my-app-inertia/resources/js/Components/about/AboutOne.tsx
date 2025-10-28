import { useTranslation } from "react-i18next";

const AboutOne = () => {
    const { t } = useTranslation("about");

    const aboutOne = t("aboutPage.aboutOne", {
        returnObjects: true,
    }) as { title: string; description: string[]; imageAlt: string };

    return (
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-8 lg:gap-20">
            <div className="w-full lg:w-1/2 text-start">
                <h1 className="roboto-medium text-2xl md:text-3xl font-extrabold max-w-4xl mx-auto uppercase text-zinc-800 mb-2">
                    {aboutOne.title}
                </h1>

                {aboutOne.description.map((paragraph, index) => (
                    <p
                        key={index}
                        className={`text-lg text-zinc-600 ${
                            index < aboutOne.description.length - 1
                                ? "mb-4"
                                : ""
                        }`}
                    >
                        {paragraph}
                    </p>
                ))}
            </div>

            <div className="relative w-full lg:w-1/2">
                <div className="absolute inset-0 z-10 bg-red-950 translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4 rounded-lg" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-transparent to-black/70 z-30 rounded-lg" />

                <img
                    className="relative z-20 w-full h-full object-cover rounded-lg"
                    src="/images/about/himawan.jpg"
                    alt={aboutOne.imageAlt}
                />
            </div>
        </div>
    );
};

export default AboutOne;
