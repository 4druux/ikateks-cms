import React, { useState } from "react";
import {
    ChevronDown,
    HomeIcon,
    LucideIcon,
    Package,
    Newspaper,
    Building2,
    Handshake,
    UserCog2,
    Building,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface User {
    role: string | null;
}

interface SidebarPageProps {
    auth: {
        user: User | null;
    };
    [key: string]: any;
}

interface SubMenuItem {
    id: string;
    label: string;
    href: string;
}

interface MenuItem {
    id: string;
    label: string;
    icon: LucideIcon;
    description: string;
    href?: string;
    canView: boolean;
    subMenu?: SubMenuItem[];
}

interface SidebarProps {
    isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const { auth } = usePage<SidebarPageProps>().props;

    const userRole = auth.user?.role;
    const normalizedRole = userRole
        ? userRole.toLowerCase().replace(" ", "")
        : null;

    const hasAccess = (allowedRoles: string[]) => {
        if (!normalizedRole) return false;
        return allowedRoles.includes(normalizedRole);
    };

    const getIsActive = (href: string) => {
        const pathname = window.location.pathname;

        if (href === "/admin") {
            return pathname === "/admin";
        }

        return pathname === href || pathname.startsWith(href + "/");
    };

    const menuItems: MenuItem[] = [
        {
            id: "home",
            label: "Home",
            icon: HomeIcon,
            description: "Home Page",
            href: "/admin",
            canView: !!auth.user,
        },
        {
            id: "about",
            label: "About",
            icon: Building,
            description: "Manage About",
            href: "/admin/about",
            canView: !!auth.user,
        },
        {
            id: "products",
            label: "Products",
            icon: Package,
            description: "Manage products",
            href: "/admin/categories",
            canView: !!auth.user && hasAccess(["superadmin", "admin"]),
        },
        {
            id: "news",
            label: "News",
            icon: Newspaper,
            description: "Manage News",
            href: "/admin/news",
            canView: !!auth.user && hasAccess(["superadmin", "admin"]),
        },
        {
            id: "principals",
            label: "Principals",
            icon: Building2,
            description: "Manage Prinsipals",
            href: "/admin/principals",
            canView: !!auth.user && hasAccess(["superadmin", "admin"]),
        },
        {
            id: "customers",
            label: "Customers",
            icon: Handshake,
            description: "Manage Customers",
            href: "/admin/customers",
            canView: !!auth.user && hasAccess(["superadmin", "admin"]),
        },
        {
            id: "manage-account",
            label: "Manage Account",
            icon: UserCog2,
            description: "Manage Account",
            href: "/admin/manage-account",
            canView: !!auth.user && hasAccess(["superadmin"]),
        },
    ];

    const listVariants: Variants = {
        visible: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
        hidden: {},
    };

    const itemVariants: Variants = {
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
        hidden: {
            opacity: 0,
            x: -20,
        },
    };

    const footerVariants: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
                delay: 0.5,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
        },
    };

    return (
        <aside
            className={`
      fixed top-0 left-0 bg-white z-50 rounded-r-xl lg:rounded-lg border transition-transform duration-300 ease-in-out w-[270px] 
      h-full lg:h-[calc(93vh-2.5rem)] lg:top-24
      ${isOpen ? "translate-x-0 lg:left-6" : "-translate-x-full"}`}
        >
            <div className="h-full flex flex-col">
                <div className="pt-6 px-4">
                    <div className="flex items-center gap-2 lg:gap-4">
                        <div>
                            <p className="text-xs md:text-sm text-zinc-600">
                                Pt. Ikateks Citra Persada - CMS Company Profile
                            </p>
                        </div>
                    </div>
                    <hr className="mt-4" />
                </div>

                <nav className="flex-1 pr-5 py-5 overflow-y-auto">
                    <AnimatePresence>
                        {isOpen && (
                            <motion.ul
                                className="space-y-2"
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={listVariants}
                            >
                                {menuItems.map((item) => {
                                    if (!item.canView) return null;

                                    const Icon = item.icon;
                                    const isParentActive =
                                        item.subMenu &&
                                        item.subMenu.some((subItem) =>
                                            getIsActive(subItem.href)
                                        );

                                    if (item.subMenu) {
                                        return (
                                            <motion.li
                                                key={item.id}
                                                variants={itemVariants}
                                            >
                                                <button
                                                    type="button"
                                                    className={`w-full flex items-center justify-between p-3 rounded-r-full border-r border-y transition-all duration-200 text-left cursor-pointer group ${
                                                        isParentActive
                                                            ? "bg-red-900 border-red-800"
                                                            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-800 border-transparent"
                                                    }`}
                                                    onClick={() =>
                                                        setOpenSubMenu(
                                                            openSubMenu ===
                                                                item.id
                                                                ? null
                                                                : item.id
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <Icon
                                                            className={`w-7 h-7 ${
                                                                isParentActive
                                                                    ? "text-white"
                                                                    : "text-zinc-600"
                                                            }`}
                                                            strokeWidth={1.5}
                                                        />
                                                        <div className="flex-1">
                                                            <div
                                                                className={`font-medium text-sm ${
                                                                    isParentActive
                                                                        ? "text-white"
                                                                        : ""
                                                                }`}
                                                            >
                                                                {item.label}
                                                            </div>
                                                            <div
                                                                className={`text-xs ${
                                                                    isParentActive
                                                                        ? "text-white"
                                                                        : "text-zinc-500 group-hover:text-zinc-800"
                                                                }`}
                                                            >
                                                                {
                                                                    item.description
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronDown
                                                        className={`w-5 h-5 transition-transform duration-200 ${
                                                            openSubMenu ===
                                                            item.id
                                                                ? "rotate-180"
                                                                : ""
                                                        } ${
                                                            isParentActive
                                                                ? "text-white"
                                                                : "text-zinc-600"
                                                        }`}
                                                    />
                                                </button>

                                                <AnimatePresence>
                                                    {openSubMenu ===
                                                        item.id && (
                                                        <motion.ul
                                                            initial={{
                                                                height: 0,
                                                                opacity: 0,
                                                                marginTop: 0,
                                                            }}
                                                            animate={{
                                                                height: "auto",
                                                                opacity: 1,
                                                                marginTop:
                                                                    "0.5rem",
                                                            }}
                                                            exit={{
                                                                height: 0,
                                                                opacity: 0,
                                                                marginTop: 0,
                                                            }}
                                                            className="pl-8 space-y-1 overflow-hidden"
                                                        >
                                                            {item.subMenu.map(
                                                                (subItem) => {
                                                                    const isSubActive =
                                                                        getIsActive(
                                                                            subItem.href
                                                                        );
                                                                    return (
                                                                        <li
                                                                            key={
                                                                                subItem.id
                                                                            }
                                                                        >
                                                                            <Link
                                                                                href={
                                                                                    subItem.href
                                                                                }
                                                                                className={`w-full flex p-2 items-center rounded-full text-left ${
                                                                                    isSubActive
                                                                                        ? "bg-red-100 text-white font-medium border-red-400 border"
                                                                                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-800 hover:translate-x-1 transition-transform duration-300 will-change-transform"
                                                                                }`}
                                                                            >
                                                                                <span className="text-sm ml-2">
                                                                                    {
                                                                                        subItem.label
                                                                                    }
                                                                                </span>
                                                                            </Link>
                                                                        </li>
                                                                    );
                                                                }
                                                            )}
                                                        </motion.ul>
                                                    )}
                                                </AnimatePresence>
                                            </motion.li>
                                        );
                                    }

                                    const isActive = getIsActive(item.href!);
                                    return (
                                        <motion.li
                                            key={item.id}
                                            variants={itemVariants}
                                        >
                                            <Link
                                                href={item.href!}
                                                className={`w-full flex items-center space-x-2 p-3 rounded-r-full border-r border-y transition-all duration-200 text-left cursor-pointer group ${
                                                    isActive
                                                        ? "bg-red-900 border-red-800"
                                                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-800 border-transparent"
                                                }`}
                                            >
                                                <Icon
                                                    className={`w-7 h-7 ${
                                                        isActive
                                                            ? "text-white"
                                                            : "text-zinc-600"
                                                    }`}
                                                    strokeWidth={1.5}
                                                />
                                                <div className="flex-1">
                                                    <div
                                                        className={`font-medium text-sm ${
                                                            isActive
                                                                ? "text-white"
                                                                : ""
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </div>
                                                    <div
                                                        className={`text-xs ${
                                                            isActive
                                                                ? "text-white"
                                                                : "text-zinc-500 group-hover:text-zinc-800"
                                                        }`}
                                                    >
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.li>
                                    );
                                })}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </nav>

                <AnimatePresence>
                    {isOpen && (
                        <div className="p-4 border-t border-zinc-200">
                            <motion.p
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={footerVariants}
                                className="text-xs uppercase text-zinc-500 text-center"
                            >
                                PT. Ikateks Citra Persada &copy;{" "}
                                {new Date().getFullYear()}
                            </motion.p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </aside>
    );
};

export default Sidebar;
