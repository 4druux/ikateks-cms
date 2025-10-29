import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "@/Components/common/Button";

const About = () => {
    const { t } = useTranslation("home");

    return (
        <div>
            <div className="text-left lg:text-center mb-6 md:mb-12">
                <h1 className="roboto-medium text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-4xl mx-auto uppercase text-zinc-800">
                    {t("homePage.aboutSection.headline")}{" "}
                    <span className="roboto-medium text-red-900 font-extrabold">
                        {t("homePage.aboutSection.headlineSpan")}
                    </span>
                </h1>
                <p className="text-2xl text-zinc-600 lg:max-w-2xl lg:mx-auto">
                    {t("homePage.aboutSection.description")}
                </p>
            </div>

            <div className="grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 xl:gap-24">
                <div>
                    <h2 className="roboto-medium text-5xl md:text-6xl lg:text-8xl font-extrabold text-red-900">
                        8+
                    </h2>
                    <p className="text-2xl text-red-800">
                        {t("homePage.aboutSection.stats.experience.title")}
                    </p>
                    <p className="text-md text-zinc-600">
                        {t(
                            "homePage.aboutSection.stats.experience.description"
                        )}
                    </p>
                </div>

                <div>
                    <h2 className="roboto-medium text-5xl md:text-6xl lg:text-8xl font-extrabold text-red-900">
                        35+
                    </h2>
                    <p className="text-2xl text-red-800">
                        {t("homePage.aboutSection.stats.cases.title")}
                    </p>
                    <p className="text-md text-zinc-600">
                        {t("homePage.aboutSection.stats.cases.description")}
                    </p>
                </div>

                <div>
                    <h2 className="roboto-medium text-5xl md:text-6xl lg:text-8xl font-extrabold text-red-900">
                        100+
                    </h2>
                    <p className="text-2xl text-red-800">
                        {t("homePage.aboutSection.stats.clients.title")}
                    </p>
                    <p className="text-md text-zinc-600">
                        {t("homePage.aboutSection.stats.clients.description")}
                    </p>
                </div>
            </div>

            <div className="text-center mt-12">
                <Button
                    as="link"
                    href="/about"
                    variant="outline"
                    iconRight={<ArrowRight className="h-5 w-5" />}
                >
                    {t("homePage.aboutSection.linkText")}
                </Button>
            </div>
        </div>
    );
};

export default About;
