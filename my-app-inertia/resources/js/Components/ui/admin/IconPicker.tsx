import React from "react";
import * as icons from "lucide-react";
import InputLabel from "@/Components/common/InputLabel";

const iconNames = [
    // --- Bisnis & Kerjasama ---
    "Handshake",
    "Building2",
    "BriefcaseBusiness",
    "Presentation",
    "Factory",
    "Globe",
    "Users",
    "UserCog",
    "Network",
    "Organization",

    // --- Profesional & Keamanan ---
    "ShieldCheck",
    "Lock",
    "BadgeCheck",
    "IdCard",
    "ClipboardCheck",
    "FolderCog",

    // --- Produk & Inovasi ---
    "Package",
    "Lightbulb",
    "Zap",
    "Rocket",
    "Wrench",
    "Cog",

    // --- Target & Kinerja ---
    "Target",
    "LineChart",
    "BarChart",
    "TrendingUp",
    "TrendingDown",
    "PieChart",
    "Activity",
    "Scaling",

    // --- Kualitas & Penghargaan ---
    "Award",
    "Trophy",
    "Medal",
    "Star",

    // --- Lingkungan & Sustainability ---
    "Recycle",
    "Leaf",
    "Earth",

    // --- Strategi & Proses ---
    "Workflow",
    "Compass",
    "Map",
    "Goal",
    "CalendarDays",
    "ChartNoAxesCombined",
];

interface IconPickerProps {
    label: string;
    selectedIcon: string;
    onChange: (name: string) => void;
    error?: string;
}

const IconPicker: React.FC<IconPickerProps> = ({
    label,
    selectedIcon,
    onChange,
    error,
}) => {
    return (
        <div>
            <InputLabel htmlFor="icon-picker" value={label} />
            <div
                id="icon-picker"
                className="mt-2 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 rounded-lg border bg-zinc-50 p-4"
            >
                {iconNames.map((name) => {
                    const IconComponent = (icons as any)[name];
                    if (!IconComponent) return null;

                    const isSelected = selectedIcon === name;

                    return (
                        <button
                            type="button"
                            key={name}
                            onClick={() => onChange(name)}
                            title={name}
                            className={`flex aspect-square w-full items-center justify-center rounded-lg border transition-all duration-150 ${
                                isSelected
                                    ? "border-red-900 bg-red-100 text-red-900 shadow-md"
                                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                        >
                            <IconComponent className="h-6 w-6" />
                        </button>
                    );
                })}
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default IconPicker;
