import React from "react";

type IconType = React.ElementType;

interface DetailItem {
    label: string;
    icon?: IconType;
}

interface HeaderContentProps {
    Icon?: IconType;
    title: string;
    description?: string;
    details?: DetailItem[];
}

const HeaderContent: React.FC<HeaderContentProps> = ({
    Icon,
    title,
    description,
    details = [],
}) => {
    return (
        <div className="flex items-center space-x-2 md:space-x-3 mb-4">
            {Icon && (
                <div className="p-3 bg-red-900 rounded-lg">
                    <Icon className="w-6 h-6 text-white" />
                </div>
            )}

            <div>
                <h3 className="text-md md:text-lg font-medium text-zinc-700">
                    {title}
                </h3>

                {description && (
                    <p className="text-xs md:text-sm text-zinc-500">
                        {description}
                    </p>
                )}

                {details.length > 0 && (
                    <div className="flex flex-row items-center gap-1 md:gap-2 md:mt-1">
                        {details.map((item, index) => {
                            const DetailIcon = item.icon;

                            return (
                                <React.Fragment key={item.label || index}>
                                    <div className="flex items-center space-x-1 md:space-x-2 text-zinc-500">
                                        {DetailIcon && (
                                            <DetailIcon className="hidden w-5 h-5 md:block" />
                                        )}
                                        <span className="text-xs md:text-sm">
                                            {item.label}
                                        </span>
                                    </div>

                                    {index < details.length - 1 && (
                                        <span className="block md:hidden">
                                            |
                                        </span>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeaderContent;
