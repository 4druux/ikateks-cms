import { useState, useEffect, useRef } from "react";
import { Variants, Transition } from "framer-motion";

const variants: Variants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
};

const transition: Transition = {
    duration: 0.2,
    ease: "easeOut",
};

export const dropdownAnimation = {
    variants,
    transition,
};

export const useDropdown = <T extends HTMLElement = HTMLElement>() => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const dropdownRef = useRef<T>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return {
        isOpen,
        setIsOpen,
        dropdownRef,
    };
};
