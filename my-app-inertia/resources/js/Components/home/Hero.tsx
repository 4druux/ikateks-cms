import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeroProps {
  onScrollDown: () => void;
}

const Hero = ({ onScrollDown }: HeroProps) => {
  const { t } = useTranslation("home");
  return (
    <section className="relative h-[100dvh] overflow-hidden text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/video/hero.mp4"
      >
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-t from-transparent via-transparent to-black/70 z-10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>
      <div className="relative z-20 flex flex-col items-start justify-center h-full px-4 sm:px-6 lg:px-8 xl:px-16">
        <div className="text-left max-w-4xl text-zinc-50">
          <h1 className="roboto-medium text-5xl md:text-8xl font-extrabold mb-2">
            {t("homePage.hero.title")}
            <span className="text-red-700">.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-2">
            {t("homePage.hero.companyName")}
          </p>
          <p className="text-md md:text-xl mb-6 leading-relaxed text-zinc-200">
            {t("homePage.hero.description")}
          </p>
        </div>
      </div>
      <div
        onClick={onScrollDown}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
        aria-label="Scroll to next section"
      >
        <ChevronDown className="w-10 h-10 text-white animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;
