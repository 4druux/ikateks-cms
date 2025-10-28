import React, { useRef } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { type TranslatedPrincipalsItem } from "../../data/principals";
import { useTranslation } from "react-i18next";

interface ModalProps {
    item: TranslatedPrincipalsItem;
    onClose: () => void;
}

const ModalPrincipals = ({ item, onClose }: ModalProps) => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLDivElement>(null);
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const sheetVariants = {
        hidden: { y: "100%" },
        visible: { y: 0 },
        exit: { y: "100%" },
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            variants={overlayVariants}
            onClick={handleOverlayClick}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <motion.div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="fixed bottom-0 left-0 right-0 w-full max-h-[90dvh] overflow-y-auto rounded-t-2xl bg-white shadow-xl md:static md:max-w-3xl md:max-h-[90vh] md:rounded-2xl"
                variants={sheetVariants}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className="sticky top-0 z-10 flex justify-center bg-white py-4 md:hidden">
                    <div className="h-1.5 w-16 rounded-full bg-zinc-300" />
                </div>

                <div className="sticky top-9 md:top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-4 md:px-6 py-2 md:py-4 shadow-sm md:shadow-none">
                    <h2 className="text-2xl font-bold text-zinc-800">
                        {item.title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-zinc-600 transition-colors bg-white/50 hover:bg-zinc-100 hover:text-zinc-900"
                        aria-label={t("modal.close")}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 md:p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="mt-1 flex flex-wrap gap-2">
                            {item.keywords.map((keyword: string) => (
                                <span
                                    key={keyword}
                                    className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-900"
                                >
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-zinc-800 mb-2">
                                {t("modal.description")}
                            </h3>
                            <p className="leading-relaxed text-zinc-600">
                                {item.description}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-zinc-800 mb-3">
                                {t("modal.overviewMethodology")}
                            </h3>
                            <ul className="space-y-2">
                                {item.overviewMethodology.map(
                                    (method: string) => (
                                        <li
                                            key={method}
                                            className="flex items-start gap-3"
                                        >
                                            <CheckCircle
                                                className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0"
                                                strokeWidth={2}
                                            />
                                            <span className="text-zinc-600">
                                                {method}
                                            </span>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ModalPrincipals;
