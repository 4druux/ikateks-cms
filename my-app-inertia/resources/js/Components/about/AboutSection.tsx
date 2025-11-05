import React from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import Button from "../common/Button";

export interface AboutItem {
    id: number;
    title: string;
    title_id: string;
    description: string;
    description_id: string;
    image_url: string | null;
}

interface AboutSectionProps {
    item: AboutItem;
    isReversed: boolean;
    showViewAllButton?: boolean;
}

const AboutSection: React.FC<AboutSectionProps> = ({
    item,
    isReversed,
    showViewAllButton = false,
}) => {
    const { i18n, t } = useTranslation("about");

    const lang = i18n.language;
    const title = lang === "id" ? item.title_id : item.title;
    const description = lang === "id" ? item.description_id : item.description;
    const paragraphs = description
        ? description.split("\n").filter((p) => p.trim() !== "")
        : [];

    const TextContent = (
        <div className="w-full lg:w-1/2 text-start">
            <h1 className="roboto-medium text-2xl md:text-3xl font-extrabold max-w-4xl mx-auto uppercase text-zinc-800 mb-2">
                {title}
            </h1>
            {paragraphs.map((paragraph, index) => (
                <p
                    key={index}
                    className={`text-lg text-zinc-600 ${
                        index < paragraphs.length - 1 ? "mb-4" : ""
                    }`}
                >
                    {paragraph}
                </p>
            ))}
        </div>
    );

    const ImageContent = (
        <div className="relative w-full lg:w-1/2">
            <div className="absolute inset-0 z-10 bg-red-950 translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4 rounded-lg" />

            {isReversed ? (
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-transparent to-black/70 z-30 rounded-lg" />
            ) : (
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-t from-transparent via-transparent to-black/70 z-30 rounded-lg" />
            )}

            <img
                className="relative z-20 w-full h-full object-cover rounded-lg aspect-[4/3]"
                src={item.image_url || "/images/placeholder.jpg"}
                alt={title}
            />
        </div>
    );

    return (
        <div>
            <div
                className={`flex items-center justify-center gap-8 lg:gap-20 ${
                    isReversed
                        ? "flex-col-reverse lg:flex-row"
                        : "flex-col lg:flex-row"
                }`}
            >
                {isReversed ? (
                    <>
                        {TextContent}
                        {ImageContent}
                    </>
                ) : (
                    <>
                        {ImageContent}
                        {TextContent}
                    </>
                )}
            </div>

            {showViewAllButton && (
                <div className="text-center mt-8 lg:mt-16">
                    <Button
                        as="link"
                        href="/about"
                        variant="outline"
                        iconRight={<ArrowRight className="h-5 w-5" />}
                    >
                        {t("aboutPage.linkText")}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AboutSection;
