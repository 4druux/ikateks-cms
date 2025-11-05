import React from "react";
import * as icons from "lucide-react";
import Button from "@/Components/common/Button";
import { Edit, Trash2, ArrowRight } from "lucide-react";

interface InfoCardProps {
    iconName: string;
    title: string;
    description: string;
    onClick?: () => void;
    learnMoreText?: string;
    href?: string;
    editHref?: string;
    onDelete?: () => void;
    isMutating?: boolean;
}

const getIcon = (name: string): React.ElementType => {
    const IconComponent = (icons as any)[name];
    return IconComponent || icons.HelpCircle;
};

const InfoCard: React.FC<InfoCardProps> = ({
    iconName,
    title,
    description,
    onClick,
    learnMoreText,
    href,
    editHref,
    onDelete,
    isMutating = false,
}) => {
    const iconComponent = getIcon(iconName);

    const hasAdminActions = editHref || onDelete;
    const hasPublicAction = (onClick && learnMoreText) || href;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (
            hasAdminActions &&
            onClick &&
            (e.key === "Enter" || e.key === " ")
        ) {
            e.preventDefault();
            onClick();
        }
    };

    const cardContent = (
        <>
            <div
                className="absolute inset-0 z-0 rounded-xl bg-red-900 opacity-0 transition-all duration-300 ease-in-out group-hover:rotate-3 group-hover:opacity-100"
                style={{
                    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))",
                }}
            />
            <div className="relative z-10 flex h-full flex-col rounded-xl bg-white p-6 shadow-sm border border-zinc-200 transition-shadow duration-300">
                <div
                    className={`flex-grow ${
                        hasAdminActions && onClick ? "cursor-pointer" : ""
                    }`}
                    onClick={hasAdminActions ? onClick : undefined}
                    onKeyDown={handleKeyDown}
                    role={hasAdminActions && onClick ? "button" : undefined}
                    tabIndex={hasAdminActions && onClick ? 0 : -1}
                >
                    <div className="mb-4 flex-shrink-0 rounded-lg bg-red-50 p-3 w-fit">
                        {React.createElement(iconComponent, {
                            className: "h-8 w-8 text-red-900",
                            strokeWidth: 1.5,
                        })}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-800 text-start line-clamp-2">
                        {title}
                    </h3>
                    <p className="mt-2 flex-grow text-zinc-600 text-start line-clamp-4">
                        {description}
                    </p>
                </div>

                {hasAdminActions ? (
                    <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
                        {editHref && (
                            <Button
                                as="link"
                                href={editHref}
                                variant="outline"
                                size="sm"
                                iconLeft={<Edit className="h-4 w-4" />}
                                onClick={(e) => e.stopPropagation()}
                            >
                                Edit
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.();
                                }}
                                disabled={isMutating}
                                iconLeft={<Trash2 className="h-4 w-4" />}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                ) : hasPublicAction && learnMoreText ? (
                    <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
                        <span className="text-sm font-semibold text-red-900">
                            {learnMoreText}
                        </span>
                        <ArrowRight className="h-5 w-5 text-zinc-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-red-900" />
                    </div>
                ) : null}
            </div>
        </>
    );

    if (href && !hasAdminActions) {
        return (
            <a href={href} className="group relative h-full block">
                {cardContent}
            </a>
        );
    }

    if (onClick && !hasAdminActions) {
        return (
            <button
                type="button"
                onClick={onClick}
                className="group relative h-full w-full text-left"
            >
                {cardContent}
            </button>
        );
    }

    return <div className="group relative h-full">{cardContent}</div>;
};

export default InfoCard;
