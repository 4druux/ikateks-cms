import React, { useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";

const ContactContent = () => {
    const { t } = useTranslation("contact");
    const form = useRef<HTMLFormElement>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        message: "",
    });

    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

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

        if (!form.current) {
            console.error("Form ref is not attached to the form element!");
            setStatusMessage("A system error occurred. Please try again.");
            return;
        }

        if (!recaptchaToken) {
            setStatusMessage("Please complete the reCAPTCHA.");
            return;
        }

        setIsLoading(true);
        setStatusMessage("");

        emailjs
            .sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID!,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
                form.current,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
            )
            .then(
                (result) => {
                    console.log("Email sent:", result.text);
                    setStatusMessage(
                        t("contactPage.section.form.status.success")
                    );
                    setIsLoading(false);
                    setFormData({
                        name: "",
                        email: "",
                        company: "",
                        message: "",
                    });
                    recaptchaRef.current?.reset();
                    setRecaptchaToken(null);
                },
                (error) => {
                    console.error("Failed to send email:", error.text);
                    setStatusMessage(
                        t("contactPage.section.form.status.error")
                    );
                    setIsLoading(false);
                }
            );
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
                            <form
                                ref={form}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
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
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={
                                        import.meta.env.VITE_RECAPTCHA_SITE_KEY!
                                    }
                                    onChange={(token) => {
                                        setRecaptchaToken(token);
                                        setStatusMessage("");
                                    }}
                                    onExpired={() => {
                                        setRecaptchaToken(null);
                                        setStatusMessage(
                                            "reCAPTCHA expired. Please check the box again."
                                        );
                                    }}
                                />
                                {statusMessage && (
                                    <p
                                        className={`text-center text-sm ${
                                            statusMessage ===
                                            t(
                                                "contactPage.section.form.status.success"
                                            )
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {statusMessage}
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={isLoading || !recaptchaToken}
                                    className="w-full bg-red-900 text-white px-6 py-3 font-semibold hover:bg-red-900/90 transition-colors flex items-center justify-center group"
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="mr-2 w-5 h-5" />
                                    )}
                                    {isLoading
                                        ? t(
                                              "contactPage.section.form.buttonLoading"
                                          )
                                        : t("contactPage.section.form.button")}
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
