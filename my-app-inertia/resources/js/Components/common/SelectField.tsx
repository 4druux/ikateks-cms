import React, { SelectHTMLAttributes } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    id: string;
    name: string;
    label: string;
    error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
    id,
    name,
    label,
    disabled = false,
    error,
    className,
    children,
    ...props
}) => {
    const selectClasses = [
        "peer",
        "block",
        "w-full",
        "appearance-none",
        "border",
        "bg-transparent",
        "px-3",
        "py-3",
        "text-zinc-900",
        "focus:outline-none",
        "focus:ring-0",
        "sm:text-sm",
        error
            ? "border-red-500 focus:border-red-500"
            : "border-zinc-300 focus:border-red-800",
        disabled ? "cursor-not-allowed bg-zinc-100" : "",
        className,
    ].join(" ");

    const labelClasses = [
        "pointer-events-none",
        "absolute",
        "left-3",
        "top-0",
        "-translate-y-1/2",
        "transform",
        "bg-white",
        "px-1",
        "text-sm",
        "transition-all",
        "duration-200",
        "ease-in-out",
        error ? "text-red-500" : "text-zinc-500",
        error ? "peer-focus:text-red-500" : "peer-focus:text-red-800",
    ].join(" ");

    return (
        <div className="w-full">
            <div className="relative pt-2">
                <select
                    id={id}
                    name={name}
                    disabled={disabled}
                    className={selectClasses}
                    {...props}
                >
                    {children}
                </select>
                <label htmlFor={id} className={labelClasses}>
                    {label}
                </label>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default SelectField;
