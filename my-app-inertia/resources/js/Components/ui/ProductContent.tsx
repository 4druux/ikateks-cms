import React, { KeyboardEvent, MouseEvent } from "react";
import { Link, router } from "@inertiajs/react";
import { Pencil, Trash2 } from "lucide-react";

interface ProductContentProps {
    imageUrl: string | null | undefined;
    title: string;
    description: string | null;
    href?: string;
    editHref?: string;
    onDelete?: () => void;
}

const defaultImage =
    "https://placehold.co/800x600?text=Placeholder+4:3&font=roboto";

const ProductContent: React.FC<ProductContentProps> = ({
    imageUrl,
    title,
    description,
    href,
    editHref,
    onDelete,
}) => {
    const handleContentClick = () => {
        if (href) {
            router.visit(href);
        }
    };

    const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleContentClick();
        }
    };

    const handleActionClick = (e: MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="relative group aspect-[4/3] w-full overflow-hidden cursor-pointer"
            onClick={handleContentClick}
            role="button"
            tabIndex={0}
            onKeyDown={handleCardKeyDown}
        >
            <img
                src={imageUrl || defaultImage}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                onError={(e) => {
                    if (e.currentTarget.src !== defaultImage) {
                        e.currentTarget.src = defaultImage;
                    }
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <h3 className="text-xl text-start font-bold transition-transform duration-300">
                    {title}
                </h3>
                <p className="text-start md:max-h-0 text-zinc-200 opacity-100 md:opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100 line-clamp-2">
                    {description || "-"}
                </p>
            </div>

            {(editHref || onDelete) && (
                <div className="absolute top-4 right-4 flex gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    {editHref && (
                        <Link
                            href={editHref}
                            onClick={handleActionClick}
                            className="p-3 text-sm text-zinc-100 bg-black/50 hover:bg-zinc-900 transition-colors duration-300"
                        >
                            <Pencil size={16} />
                        </Link>
                    )}
                    {onDelete && (
                        <button
                            type="button"
                            className="p-3 text-sm text-white bg-red-900/50 hover:bg-red-900 transition-colors duration-300"
                            onClick={(e) => {
                                handleActionClick(e);
                                onDelete();
                            }}
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductContent;
