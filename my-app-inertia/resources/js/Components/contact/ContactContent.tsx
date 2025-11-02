import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

const ContactContent = () => {
    const { t } = useTranslation("contact");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <section className="mt-10 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-left lg:text-center mb-6 md:mb-12">
                    <h1 className="roboto-medium text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-4xl mx-auto uppercase text-zinc-800">
                        {t("contactPage.section.headline")}{" "}
                        <span className="roboto-medium text-red-900 font-extrabold">
                            {t("contactPage.section.headline-span")}
                        </span>
                    </h1>

                    <p className="text-2xl text-zinc-600 lg:max-w-2xl lg:mx-auto">
                        {t("contactPage.section.description")}
                    </p>
                </div>

                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
                    <div className="w-full md:w-1/2">
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="bg-red-50 p-3 rounded-lg mr-4">
                                    <Mail className="w-6 h-6 text-red-900" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-800 mb-1">
                                        {t("contactPage.section.info.email")}
                                    </h3>
                                    <a
                                        href="mailto:admin@ikateks.com"
                                        className="text-zinc-600 hover:text-blue-800 hover:underline"
                                    >
                                        admin@ikateks.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-red-50 p-3 rounded-lg mr-4">
                                    <Phone className="w-6 h-6 text-red-900" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-800 mb-1">
                                        {t("contactPage.section.info.phone")}
                                    </h3>
                                    <a
                                        href="https://api.whatsapp.com/send/?phone=62882211232801&text&type=phone_number&app_absent=0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-zinc-600 hover:text-blue-800 hover:underline"
                                    >
                                        +62 822 1123 2801
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-red-50 p-3 rounded-lg mr-4">
                                    <MapPin className="w-6 h-6 text-red-900" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-800 mb-1">
                                        {t("contactPage.section.info.address")}
                                    </h3>
                                    <a
                                        href="https://maps.app.goo.gl/y2mQ5rFuEFnDu9Zu9"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-zinc-600 hover:text-blue-800 hover:underline"
                                    >
                                        Vila Dago Tol, Blok A1 No. 27-28
                                        Tangerang Selatan, Banten 15414
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-red-50 p-6 rounded-lg">
                            <h3 className="font-semibold text-zinc-800 mb-3">
                                {t("contactPage.section.hours.title")}
                            </h3>
                            <div className="space-y-2 text-zinc-600">
                                <p>{t("contactPage.section.hours.weekdays")}</p>
                                <p>{t("contactPage.section.hours.weekends")}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <div className="bg-white md:p-6 rounded-xl md:shadow-sm">
                            <h2 className="text-2xl font-bold text-zinc-800 mb-6">
                                {t("contactPage.section.form.title")}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-zinc-700 mb-2"
                                    >
                                        <p>
                                            {t(
                                                "contactPage.section.form.labels.name"
                                            )}{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </p>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-zinc-300 focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition resize-none"
                                        placeholder={t(
                                            "contactPage.section.form.placeholders.name"
                                        )}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-zinc-700 mb-2"
                                    >
                                        <p>
                                            {t(
                                                "contactPage.section.form.labels.email"
                                            )}{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </p>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-zinc-300 focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition resize-none"
                                        placeholder={t(
                                            "contactPage.section.form.placeholders.email"
                                        )}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="company"
                                        className="block text-sm font-medium text-zinc-700 mb-2"
                                    >
                                        {t(
                                            "contactPage.section.form.labels.company"
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-zinc-300 focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition resize-none"
                                        placeholder={t(
                                            "contactPage.section.form.placeholders.company"
                                        )}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium text-zinc-700 mb-2"
                                    >
                                        <p>
                                            {t(
                                                "contactPage.section.form.labels.message"
                                            )}{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </p>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-2 border border-zinc-300 focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition resize-none"
                                        placeholder={t(
                                            "contactPage.section.form.placeholders.message"
                                        )}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-red-900 text-white px-6 py-3 font-semibold hover:bg-red-900/90 transition-colors flex items-center justify-center group"
                                >
                                    {t("contactPage.section.form.button")}
                                    <Send className="ml-2 w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 ease-in-out" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactContent;
