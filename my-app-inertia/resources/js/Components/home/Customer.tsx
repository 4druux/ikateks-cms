import { useTranslation } from "react-i18next";
import { customerLogos } from "../../data/customer";

const Customer = () => {
  const { t } = useTranslation("home");
  const logosToRender = [...customerLogos, ...customerLogos];

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
              <li key={index} className="flex-shrink-0">
                <img
                  src={logo.logoUrl}
                  alt={logo.name}
                  className="h-28 md:h-40 w-auto object-contain filter grayscale opacity-60
                    transition-all duration-300 hover:grayscale-0 hover:opacity-100
                  "
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
