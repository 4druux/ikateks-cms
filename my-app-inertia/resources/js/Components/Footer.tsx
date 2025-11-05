import { ArrowUpRight } from "lucide-react";
import {
    FaFacebook,
    FaInstagram,
    FaXTwitter,
    FaLinkedin,
    FaYoutube,
} from "react-icons/fa6";
import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-gradient-to-t from-zinc-900 via-zinc-950 to-zinc-950 text-white -mt-1">
            <div className="px-4 sm:px-6 lg:px-8 xl:px-16 md:pt-10 pb-8 xl:pt-24">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-24">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="">
                            <img
                                src="/images/Logo-Tulisan-ICP-Putih.png"
                                alt="Logo ICP"
                                className="h-12"
                            />
                        </Link>

                        <p className="text-zinc-400 text-sm max-w-sm">
                            {t("footer.description")}
                        </p>
                        <Link
                            href="/about"
                            className="flex items-center gap-1 text-sky-700 hover:text-sky-600 transition duration-300 text-sm font-semibold hover:underline group"
                        >
                            {t("footer.moreAbout")}
                            <span>
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 ease-in-out" />
                            </span>
                        </Link>
                    </div>

                    <div className="block md:hidden border-t border-zinc-600 w-full" />

                    <div className="md:hidden">
                        <h4 className="font-semibold text-zinc-200 mb-4">
                            {t("footer.followUs")}
                        </h4>
                        <div className="flex items-start gap-4">
                            <a
                                href="/"
                                aria-label={t("footer.aria.facebook")}
                                className="p-2 bg-white hover:-translate-y-1 rounded-full transition duration-300"
                            >
                                <FaFacebook className="w-5 h-5 text-zinc-800" />
                            </a>
                            <a
                                href="/"
                                aria-label={t("footer.aria.instagram")}
                                className="p-2 bg-white hover:-translate-y-1 rounded-full transition duration-300"
                            >
                                <FaInstagram className="w-5 h-5 text-zinc-800" />
                            </a>
                            <a
                                href="/"
                                aria-label={t("footer.aria.x")}
                                className="p-2 bg-white hover:-translate-y-1 rounded-full transition duration-300"
                            >
                                <FaXTwitter className="w-5 h-5 text-zinc-800" />
                            </a>
                            <a
                                href="/"
                                aria-label={t("footer.aria.linkedin")}
                                className="p-2 bg-white hover:-translate-y-1 rounded-full transition duration-300"
                            >
                                <FaLinkedin className="w-5 h-5 text-zinc-800" />
                            </a>
                            <a
                                href="/"
                                aria-label={t("footer.aria.youtube")}
                                className="p-2 bg-white hover:-translate-y-1 rounded-full transition duration-300"
                            >
                                <FaYoutube className="w-5 h-5 text-zinc-800" />
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 md:col-span-3 gap-8">
                        <div className="flex flex-col gap-2">
                            <h4 className="font-semibold text-zinc-200 mb-2">
                                {t("footer.headings.navigation")}
                            </h4>
                            <Link
                                href="/"
                                className="text-zinc-400 hover:text-white hover:underline hover:translate-x-1 transition duration-300 text-sm"
                            >
                                {t("nav.home")}
                            </Link>
                            <Link
                                href="/about"
                                className="text-zinc-400 hover:text-white hover:underline hover:translate-x-1 transition duration-300 text-sm"
                            >
                                {t("nav.about")}
                            </Link>

                            <Link
                                href="/products"
                                className="text-zinc-400 hover:text-white hover:underline hover:translate-x-1 transition duration-300 text-sm"
                            >
                                {t("nav.products")}
                            </Link>
                            <Link
                                href="/principals"
                                className="text-zinc-400 hover:text-white hover:underline hover:translate-x-1 transition duration-300 text-sm"
                            >
                                {t("nav.principals")}
                            </Link>
                            <Link
                                href="/news"
                                className="text-zinc-400 hover:text-white hover:underline hover:translate-x-1 transition duration-300 text-sm"
                            >
                                {t("nav.news")}
                            </Link>
                            <Link
                                href="/customers"
                                className="text-zinc-400 hover:text-white hover:underline hover:translate-x-1 transition duration-300 text-sm"
                            >
                                {t("nav.customers")}
                            </Link>
                            <Link
                                href="/privacy-policy"
                                className="text-zinc-400 hover:text-white hover:underline hover:translate-x-1 transition duration-300 text-sm"
                            >
                                {t("footer.links.privacy")}
                            </Link>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="font-semibold text-zinc-200 mb-2">
                                {t("footer.headings.contact")}
                            </h4>
                            <a
                                href="https://api.whatsapp.com/send/?phone=6282211232801&text&type=phone_number&app_absent=0"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-400 hover:text-white hover:underline hover:translate-x-1 transition duration-300 text-sm"
                            >
                                +62 822 1123 2801
                            </a>
                            <a
                                href="mailto:admin@ikateks.com"
                                className="text-zinc-400 hover:text-white hover:underline hover:translate-x-1 transition duration-300 text-sm"
                            >
                                admin@ikateks.com
                            </a>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="font-semibold text-zinc-200">
                                {t("footer.headings.location")}
                            </h4>
                            <a
                                href="https://maps.app.goo.gl/y2mQ5rFuEFnDu9Zu9"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-400 hover:text-white hover:underline text-sm not-italic"
                            >
                                Vila Dago Tol, Blok A1 No. 27-28 Tangerang
                                Selatan, Banten 15414
                            </a>
                        </div>

                        <div className="hidden md:block">
                            <div className="flex flex-col gap-2">
                                <h4 className="font-semibold text-zinc-200 mb-2">
                                    {t("footer.followUs")}
                                </h4>

                                <div className="flex gap-4">
                                    <a
                                        href="/"
                                        aria-label={t("footer.aria.facebook")}
                                        className="p-2 bg-white hover:-translate-y-1 rounded-full transition duration-300"
                                    >
                                        <FaFacebook className="w-5 h-5 text-zinc-800" />
                                    </a>
                                    <a
                                        href="/"
                                        aria-label={t("footer.aria.instagram")}
                                        className="p-2 bg-white hover:-translate-y-1 rounded-full transition duration-300"
                                    >
                                        <FaInstagram className="w-5 h-5 text-zinc-800" />
                                    </a>
                                    <a
                                        href="/"
                                        aria-label={t("footer.aria.x")}
                                        className="p-2 bg-white hover:-translate-y-1 rounded-full transition duration-300"
                                    >
                                        <FaXTwitter className="w-5 h-5 text-zinc-800" />
                                    </a>
                                    <a
                                        href="/"
                                        aria-label={t("footer.aria.linkedin")}
                                        className="p-2 bg-white hover:-translate-y-1 rounded-full transition duration-300"
                                    >
                                        <FaLinkedin className="w-5 h-5 text-zinc-800" />
                                    </a>
                                    <a
                                        href="/"
                                        aria-label={t("footer.aria.youtube")}
                                        className="p-2 bg-white hover:-translate-y-1 rounded-full transition duration-300"
                                    >
                                        <FaYoutube className="w-5 h-5 text-zinc-800" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-center gap-6 md:gap-10">
                    <div className="border-t border-zinc-800 w-full" />

                    <p className="text-sm text-center text-zinc-500">
                        © {new Date().getFullYear()} Ikateks Citra Persada .{" "}
                        {t("footer.copyright")}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
