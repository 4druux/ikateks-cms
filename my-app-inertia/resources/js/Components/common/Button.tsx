import { clsx } from "clsx";
import { Link } from "@inertiajs/react";
import React, { ButtonHTMLAttributes, ReactNode, ComponentProps } from "react";

type ButtonSize = "sm" | "md" | "lg" | "xl";
type ResponsiveSize = Partial<
    Record<"base" | "sm" | "md" | "lg" | "xl", ButtonSize>
>;
type ButtonVariant = "primary" | "outline" | "danger" | "success" | "blue";

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-base",
    lg: "px-4 py-3 text-base",
    xl: "px-6 py-3.5 text-base",
};

interface BaseButtonProps {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize | ResponsiveSize;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    className?: string;
}

type ButtonAsButtonProps = BaseButtonProps &
    Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        keyof BaseButtonProps | "type"
    > & {
        as?: "button";
        type?: "button" | "submit" | "reset";
        href?: never;
    };

type ButtonAsLinkProps = BaseButtonProps &
    Omit<ComponentProps<typeof Link>, keyof BaseButtonProps | "href"> & {
        as: "link";
        href: string;
        type?: never;
    };

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    size = "lg",
    iconLeft,
    iconRight,
    className,
    ...props
}) => {
    const baseStyles =
        "inline-flex items-center justify-center font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed gap-2";

    const variantStyles: Record<ButtonVariant, string> = {
        primary:
            "bg-red-900 text-white hover:bg-white hover:text-red-900 border border-red-900",
        outline:
            "border border-red-800 bg-transparent text-red-800 hover:bg-red-900 hover:text-white",
        danger: "border bg-red-50 border-red-600 text-red-600 hover:bg-red-100",
        success:
            "border bg-green-50 border-green-600 text-green-600 hover:bg-green-100",
        blue: "border bg-blue-50 border-blue-600 bg-transparent text-blue-600 hover:bg-blue-100",
    };

    const getSizeClasses = () => {
        if (typeof size === "object") {
            const responsiveClasses = Object.entries(size).map(
                ([breakpoint, sizeValue]) => {
                    const styles = sizeStyles[sizeValue];
                    if (!styles) return "";
                    return breakpoint === "base"
                        ? styles
                        : styles
                              .split(" ")
                              .map((cls) => `${breakpoint}:${cls}`)
                              .join(" ");
                }
            );
            return responsiveClasses.join(" ");
        }
        return sizeStyles[size as ButtonSize] || sizeStyles.lg;
    };

    const allClassName = clsx(
        baseStyles,
        variantStyles[variant as ButtonVariant],
        getSizeClasses(),
        className
    );

    if (props.as === "link") {
        const { as, ...linkProps } = props;
        return (
            <Link {...linkProps} className={allClassName}>
                {iconLeft}
                {children}
                {iconRight}
            </Link>
        );
    }

    const { as, type = "button", ...buttonProps } = props;
    return (
        <button type={type} {...buttonProps} className={allClassName}>
            {iconLeft}
            {children}
            {iconRight}
        </button>
    );
};

export default Button;
