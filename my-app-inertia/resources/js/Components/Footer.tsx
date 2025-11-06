import React from "react";
import { ArrowUpRight } from "lucide-react";
import * as FaIcons from "react-icons/fa6";
import { Link, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { SettingsData } from "@/Utils/api/settings";

interface SharedProps {
    settings: SettingsData;
}

const getSocialIcon = (name: string): React.ElementType => {
    const Icon = (FaIcons as any)[name];
    return Icon || FaIcons.FaLink;
};

const Footer = () => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    const { settings } = usePage().props as unknown as SharedProps;

    const description =
        lang === "id"
            ? settings?.footer_description_id
            : settings?.footer_description;
    const location =
        lang === "id"
            ? settings?.location_address_id
            : settings?.location_address;
    const copyright =
        lang === "id" ? settings?.copyright_text_id : settings?.copyright_text;

    const socialLinks = Array.isArray(settings?.social_links)
        ? settings.social_links
        : [];

    const renderSocialIcons = () => (
        <div className="flex items-start gap-4">
            {socialLinks.map((link) => {
                const IconComponent = getSocialIcon(link.icon_name);
                return (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.name}
                        className="p-2 bg-white hover:-translate-y-1 rounded-full transition duration-300"
                    >
                        <IconComponent className="w-5 h-5 text-zinc-800" />
                    </a>
                );
            })}
        </div>
    );

    return (
        <footer className="bg-gradient-to-t from-zinc-900 via-zinc-950 to-zinc-950 text-white -mt-1">
            <div className="px-4 sm:px-6 lg:px-8 xl:px-16 md:pt-10 pb-8 xl:pt-24">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-24">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="">
                            <img
                                src="/images/Logo-Tulisan-ICP-Putih.png"
                                alt="Logo ICP"
                                className="h-12 sm:h-8 xl:h-10"
                            />
                        </Link>
                        <p className="text-zinc-400 text-sm max-w-sm">
                            {description || t("footer.description")}
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
                        {renderSocialIcons()}
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
                            {settings?.contact_phone_href && (
                                <a
                                    href={settings.contact_phone_href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-400 hover:text-white hover:underline hover:translate-x-1 transition duration-300 text-sm"
                                >
                                    {settings.contact_phone_number}
                                </a>
                            )}
                            {settings?.contact_email && (
                                <a
                                    href={`mailto:${settings.contact_email}`}
                                    className="text-zinc-400 hover:text-white hover:underline hover:translate-x-1 transition duration-300 text-sm"
                                >
                                    {settings.contact_email}
                                </a>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="font-semibold text-zinc-200">
                                {t("footer.headings.location")}
                            </h4>
                            {settings?.location_href && (
                                <a
                                    href={settings.location_href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-400 hover:text-white hover:underline text-sm not-italic"
                                >
                                    {location}
                                </a>
                            )}
                        </div>

                        <div className="hidden md:block">
                            <div className="flex flex-col gap-2">
                                <h4 className="font-semibold text-zinc-200 mb-2">
                                    {t("footer.followUs")}
                                </h4>
                                {renderSocialIcons()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-center gap-6 md:gap-10">
                    <div className="border-t border-zinc-800 w-full" />
                    <p className="text-sm text-center text-zinc-500">
                        © {new Date().getFullYear()}{" "}
                        {settings?.company_name || "Ikateks Citra Persada"} .{" "}
                        {copyright || t("footer.copyright")}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
