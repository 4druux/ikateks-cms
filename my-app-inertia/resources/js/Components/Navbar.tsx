import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Globe, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import useSWR from "swr";
import { Category, Product, fetcher } from "@/Utils/api";
import DotLoader from "./ui/DotLoader";

const ProductListForCategory: React.FC<{
    activeCategorySlug: string | null;
    onProductClick?: () => void;
}> = ({ activeCategorySlug, onProductClick }) => {
    const { t, i18n } = useTranslation("product");

    const { data, error, isLoading } = useSWR(
        activeCategorySlug
            ? `/api/categories/${activeCategorySlug}/products`
            : null,
        fetcher
    );

    const products = (data as { products?: Product[] })?.products;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[100px]">
                <DotLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full min-h-[100px] text-zinc-500">
                Failed to load products.
            </div>
        );
    }

    if (!activeCategorySlug || !products || products.length === 0) {
        return (
            <div className="flex items-center justify-center h-full min-h-[100px] text-zinc-500 p-6 text-center">
                {t("product:product.common.noProducts")}
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-2">
            {products.map((product) => {
                const productName =
                    i18n.language === "id" ? product.name_id : product.name;
                return (
                    <Link
                        key={product.id}
                        href={`/products/${activeCategorySlug}/${product.slug}`}
                        className="block rounded-lg p-2 hover:bg-zinc-100 transition-colors group"
                        onClick={onProductClick}
                    >
                        <p className="font-medium text-zinc-800 group-hover:text-red-700">
                            {productName}
                        </p>
                    </Link>
                );
            })}
        </div>
    );
};

const Navbar = () => {
    const { t, i18n } = useTranslation(["common", "product"]);
    const [isOpen, setIsOpen] = useState(false);
    const { url } = usePage();
    const [isVisible, setIsVisible] = useState(true);
    const [isTop, setIsTop] = useState(true);
    const lastScrollY = useRef(0);

    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
    const [hoveredCategorySlug, setHoveredCategorySlug] = useState<
        string | null
    >(null);
    const dropdownTimer = useRef<number | null>(null);
    const { data: categories } = useSWR<Category[]>("/api/categories", fetcher);

    const [isMobileProductOpen, setIsMobileProductOpen] = useState(false);
    const [mobileActiveCategorySlug, setMobileActiveCategorySlug] = useState<
        string | null
    >(null);

    const activeCategorySlug = useMemo(() => {
        if (hoveredCategorySlug) {
            return hoveredCategorySlug;
        }
        if (categories && categories.length > 0) {
            return categories[0].slug;
        }
        return null;
    }, [categories, hoveredCategorySlug]);

    const navLinks = [
        { name: t("nav.home"), path: "/" },
        { name: t("nav.about"), path: "/about" },
        { name: t("nav.products"), path: "/products" },
        { name: t("nav.principals"), path: "/principals" },
        { name: t("nav.news"), path: "/news" },
        { name: t("nav.customers"), path: "/customers" },
    ];

    const isActive = (path: string) => {
        if (path === "/products") {
            return url.startsWith("/products");
        }
        return url === path;
    };

    const changeLanguage = (lng: "en" | "id") => {
        i18n.changeLanguage(lng);
    };

    const handleDropdownEnter = () => {
        if (dropdownTimer.current) {
            clearTimeout(dropdownTimer.current);
        }
        setIsProductDropdownOpen(true);
    };

    const handleDropdownLeave = () => {
        dropdownTimer.current = setTimeout(() => {
            setIsProductDropdownOpen(false);
        }, 200);
    };

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
            const TOP_THRESHOLD = 100;
            const HIDE_THRESHOLD = 10;

            if (currentScrollY <= TOP_THRESHOLD) {
                setIsTop(true);
            } else {
                setIsTop(false);
            }

            if (currentScrollY > HIDE_THRESHOLD) {
                if (currentScrollY > lastScrollY.current) {
                    setIsVisible(false);
                } else {
                    setIsVisible(true);
                }
            } else {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        if (!isOpen) {
            window.addEventListener("scroll", controlNavbar);
        }

        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const getLinkClassName = (path: string) => {
        const active = isActive(path);
        const base =
            "relative group px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1";
        const activeColor = isTop && !isOpen ? "text-white" : "text-red-700";
        const inactiveColor =
            isTop && !isOpen
                ? "text-zinc-300 hover:text-white"
                : "text-zinc-700 hover:text-red-700";
        return `${base} ${active ? activeColor : inactiveColor}`;
    };

    const getSpanClassName = (path: string) => {
        const active = isActive(path);
        const base =
            "absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1/2 h-[2px] transition duration-500 transform";
        const color = isTop && !isOpen ? "bg-white" : "bg-red-700";
        const scale = active
            ? "scale-x-100"
            : "scale-x-0 group-hover:scale-x-100";
        return `${base} ${color} ${scale}`;
    };

    return (
        <>
            <nav
                className={`fixed w-full top-0 z-50 transition-all duration-300 ease-in-out ${
                    isVisible || isOpen ? "translate-y-0" : "-translate-y-full"
                } ${
                    isTop && !isOpen
                        ? "bg-transparent mt-2"
                        : "bg-white shadow-md"
                } ${
                    isOpen
                        ? "bg-white border-b border-zinc-200 shadow-none"
                        : "border-none"
                }`}
            >
                <div className="px-4 sm:px-6 lg:px-8 xl:px-16">
                    <div className="flex justify-between items-center py-3">
                        <div className="flex-shrink-0">
                            <Link href="/" className="">
                                <img
                                    src={
                                        isTop && !isOpen
                                            ? "/images/icp-white.png"
                                            : "/images/icp.png"
                                    }
                                    alt="Logo"
                                    className="h-9 pr-20"
                                />
                            </Link>
                        </div>

                        <div className="hidden lg:flex flex-grow justify-center">
                            <div className="flex space-x-4 xl:space-x-6">
                                {navLinks.map((link) =>
                                    link.path === "/products" ? (
                                        <div
                                            key={link.path}
                                            className="relative"
                                            onMouseEnter={handleDropdownEnter}
                                            onMouseLeave={handleDropdownLeave}
                                        >
                                            <Link
                                                href={link.path}
                                                className={getLinkClassName(
                                                    link.path
                                                )}
                                            >
                                                <span className="relative">
                                                    {link.name}
                                                    <span
                                                        className={getSpanClassName(
                                                            link.path
                                                        )}
                                                    />
                                                </span>
                                                <ChevronDown className="h-4 w-4" />
                                            </Link>
                                            <AnimatePresence>
                                                {isProductDropdownOpen && (
                                                    <motion.div
                                                        initial={{
                                                            opacity: 0,
                                                            y: 10,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: 10,
                                                        }}
                                                        transition={{
                                                            duration: 0.2,
                                                        }}
                                                        className="absolute -left-32 top-full pt-4"
                                                    >
                                                        <div className="w-[700px] bg-white rounded-lg shadow-2xl overflow-hidden border border-zinc-100 flex">
                                                            <div className="w-2/5 bg-zinc-50 border-r border-zinc-200 py-4">
                                                                <h4 className="px-4 pb-2 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                                                                    {t(
                                                                        "product:product.common.categories"
                                                                    )}
                                                                </h4>
                                                                <div className="max-h-80 overflow-y-auto">
                                                                    {categories?.map(
                                                                        (
                                                                            category
                                                                        ) => {
                                                                            const categoryName =
                                                                                i18n.language ===
                                                                                "id"
                                                                                    ? category.title_id
                                                                                    : category.title;
                                                                            const isActiveCat =
                                                                                activeCategorySlug ===
                                                                                category.slug;
                                                                            return (
                                                                                <Link
                                                                                    key={
                                                                                        category.id
                                                                                    }
                                                                                    href={`/products/${category.slug}`}
                                                                                    className={`flex justify-between items-center p-3 text-sm font-medium transition-colors ${
                                                                                        isActiveCat
                                                                                            ? "bg-white text-red-700"
                                                                                            : "text-zinc-700 hover:bg-zinc-100"
                                                                                    }`}
                                                                                    onMouseEnter={() =>
                                                                                        setHoveredCategorySlug(
                                                                                            category.slug
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        categoryName
                                                                                    }
                                                                                    {isActiveCat && (
                                                                                        <ChevronRight className="h-4 w-4" />
                                                                                    )}
                                                                                </Link>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="w-3/5 py-4">
                                                                <h4 className="px-4 pb-2 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                                                                    {t(
                                                                        "product:product.common.products"
                                                                    )}
                                                                </h4>
                                                                <div className="px-2 max-h-80 overflow-y-auto">
                                                                    <ProductListForCategory
                                                                        activeCategorySlug={
                                                                            activeCategorySlug
                                                                        }
                                                                        onProductClick={() =>
                                                                            setIsProductDropdownOpen(
                                                                                false
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <Link
                                            key={link.path}
                                            href={link.path}
                                            className={getLinkClassName(
                                                link.path
                                            )}
                                        >
                                            <span className="relative">
                                                {link.name}
                                                <span
                                                    className={getSpanClassName(
                                                        link.path
                                                    )}
                                                />
                                            </span>
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="hidden lg:flex items-center space-x-4">
                                <div className="flex items-center text-sm font-medium">
                                    <Globe
                                        className={`w-5 h-5 mb-0.5 transition-colors duration-200 ${
                                            isTop && !isOpen
                                                ? "text-white"
                                                : "text-red-700"
                                        }`}
                                    />
                                    <button
                                        onClick={() => changeLanguage("en")}
                                        className={`px-2 transition-colors duration-200 ${
                                            i18n.language === "en"
                                                ? isTop && !isOpen
                                                    ? "text-white font-bold roboto-medium"
                                                    : "text-red-700 font-bold roboto-medium"
                                                : isTop && !isOpen
                                                ? "text-zinc-300 hover:text-white"
                                                : "text-zinc-500 hover:text-red-700"
                                        }`}
                                    >
                                        EN
                                    </button>
                                    <span
                                        className={
                                            isTop && !isOpen
                                                ? "text-zinc-400"
                                                : "text-zinc-300"
                                        }
                                    >
                                        |
                                    </span>
                                    <button
                                        onClick={() => changeLanguage("id")}
                                        className={`px-2 transition-colors duration-200 ${
                                            i18n.language === "id"
                                                ? isTop && !isOpen
                                                    ? "text-white font-bold roboto-medium"
                                                    : "text-red-700 font-bold roboto-medium"
                                                : isTop && !isOpen
                                                ? "text-zinc-300 hover:text-white"
                                                : "text-zinc-500 hover:text-red-700"
                                        }`}
                                    >
                                        ID
                                    </button>
                                </div>
                                <Link
                                    href="/contact"
                                    className={`px-4 py-2 text-sm font-medium border transition-colors duration-300 ${
                                        isTop && !isOpen
                                            ? "text-white hover:bg-red-900/50"
                                            : "bg-red-800 text-white hover:bg-white hover:text-red-700"
                                    } hover:border-red-800`}
                                >
                                    {t("nav.contact")}
                                </Link>
                            </div>
                            <div className="lg:hidden ml-4">
                                <div className="flex items-center">
                                    <Globe
                                        className={`w-5 h-5 mb-0.5 transition-colors duration-200 ${
                                            isTop && !isOpen
                                                ? "text-white"
                                                : "text-red-700"
                                        }`}
                                    />
                                    <div className="flex items-center text-sm font-medium">
                                        <button
                                            onClick={() => changeLanguage("en")}
                                            className={`px-1 transition-colors duration-200 ${
                                                i18n.language === "en"
                                                    ? isTop && !isOpen
                                                        ? "text-white font-bold roboto-medium"
                                                        : "text-red-700 font-bold roboto-medium"
                                                    : isTop && !isOpen
                                                    ? "text-zinc-300"
                                                    : "text-zinc-500"
                                            }`}
                                        >
                                            EN
                                        </button>
                                        <span
                                            className={
                                                isTop && !isOpen
                                                    ? "text-zinc-400"
                                                    : "text-zinc-300"
                                            }
                                        >
                                            |
                                        </span>
                                        <button
                                            onClick={() => changeLanguage("id")}
                                            className={`px-1 transition-colors duration-200 ${
                                                i18n.language === "id"
                                                    ? isTop && !isOpen
                                                        ? "text-white font-bold roboto-medium"
                                                        : "text-red-700 font-bold roboto-medium"
                                                    : isTop && !isOpen
                                                    ? "text-zinc-300"
                                                    : "text-zinc-500"
                                            }`}
                                        >
                                            ID
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(!isOpen)}
                                        className="p-2 rounded-md"
                                        aria-label="Toggle menu"
                                    >
                                        {isOpen ? (
                                            <X className="h-6 w-6 text-zinc-700" />
                                        ) : (
                                            <Menu
                                                className={`h-6 w-6 ${
                                                    isTop
                                                        ? "text-white"
                                                        : "text-zinc-700"
                                                }`}
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div
                className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out lg:hidden ${
                    isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                } bg-white px-4 sm:px-6 lg:px-8 py-4 flex flex-col`}
            >
                <div className="pt-20 overflow-y-auto flex-grow">
                    <div className="space-y-2">
                        {navLinks.map((link) =>
                            link.path === "/products" ? (
                                <div key="mobile-products">
                                    <button
                                        onClick={() => {
                                            setIsMobileProductOpen(
                                                !isMobileProductOpen
                                            );
                                            setMobileActiveCategorySlug(null);
                                        }}
                                        className={`flex w-full justify-between items-center rounded-md px-4 py-3 text-lg font-medium transition-colors duration-200 ${
                                            isActive(link.path)
                                                ? "bg-red-50 text-red-700"
                                                : "text-zinc-700 hover:bg-zinc-50 hover:text-red-700"
                                        }`}
                                    >
                                        <span>{link.name}</span>
                                        <ChevronDown
                                            className={`h-5 w-5 transition-transform ${
                                                isMobileProductOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {isMobileProductOpen && (
                                            <motion.div
                                                initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    height: "auto",
                                                    opacity: 1,
                                                }}
                                                exit={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden pl-4 mt-1 space-y-1"
                                            >
                                                <h4 className="px-4 pt-2 pb-1 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                                                    {t(
                                                        "product:product.common.categories"
                                                    )}
                                                </h4>
                                                {categories?.map((category) => {
                                                    const categoryName =
                                                        i18n.language === "id"
                                                            ? category.title_id
                                                            : category.title;
                                                    const isCatActive =
                                                        mobileActiveCategorySlug ===
                                                        category.slug;
                                                    return (
                                                        <div key={category.id}>
                                                            <button
                                                                onClick={() =>
                                                                    setMobileActiveCategorySlug(
                                                                        isCatActive
                                                                            ? null
                                                                            : category.slug
                                                                    )
                                                                }
                                                                className={`flex w-full justify-between items-center rounded-md px-4 py-2 text-base font-medium transition-colors ${
                                                                    isCatActive
                                                                        ? "text-red-700"
                                                                        : "text-zinc-600 hover:bg-zinc-100"
                                                                }`}
                                                            >
                                                                <span>
                                                                    {
                                                                        categoryName
                                                                    }
                                                                </span>
                                                                <ChevronRight
                                                                    className={`h-4 w-4 transition-transform ${
                                                                        isCatActive
                                                                            ? "rotate-90"
                                                                            : ""
                                                                    }`}
                                                                />
                                                            </button>
                                                            <AnimatePresence>
                                                                {isCatActive && (
                                                                    <motion.div
                                                                        initial={{
                                                                            height: 0,
                                                                            opacity: 0,
                                                                        }}
                                                                        animate={{
                                                                            height: "auto",
                                                                            opacity: 1,
                                                                        }}
                                                                        exit={{
                                                                            height: 0,
                                                                            opacity: 0,
                                                                        }}
                                                                        transition={{
                                                                            duration: 0.2,
                                                                        }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <div className="py-2 pl-4 border-l border-zinc-200 ml-4">
                                                                            <h4 className="pb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                                                                {t(
                                                                                    "product:product.common.products"
                                                                                )}
                                                                            </h4>
                                                                            <ProductListForCategory
                                                                                activeCategorySlug={
                                                                                    mobileActiveCategorySlug
                                                                                }
                                                                                onProductClick={() =>
                                                                                    setIsOpen(
                                                                                        false
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block rounded-md px-4 py-3 text-lg font-medium transition-colors duration-200 ${
                                        isActive(link.path)
                                            ? "bg-red-50 text-red-700"
                                            : "text-zinc-700 hover:bg-zinc-50 hover:text-red-700"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            )
                        )}
                    </div>
                </div>
                <div className="mt-auto pb-4">
                    <Link
                        href="/contact"
                        onClick={() => setIsOpen(false)}
                        className="block w-full bg-red-900 px-4 py-3 text-center text-lg font-medium text-white transition-colors duration-300 hover:bg-white hover:text-red-900 border border-red-800"
                    >
                        {t("nav.contact")}
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Navbar;
