import React, { TextareaHTMLAttributes } from "react";

interface DescriptionFieldProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    id: string;
    name: string;
    label: string;
    error?: string;
    rows?: number;
}

const DescriptionField: React.FC<DescriptionFieldProps> = ({
    id,
    name,
    label,
    rows = 4,
    disabled = false,
    error,
    className,
    ...props
}) => {
    const textareaClasses = [
        "peer",
        "block",
        "w-full",
        "appearance-none",
        "border",
        "bg-transparent",
        "px-3",
        "py-3",
        "text-zinc-900",
        "placeholder-transparent",
        "focus:outline-none",
        "focus:ring-0",
        "sm:text-sm",
        "min-h-[calc(theme(spacing.3)*2+theme(fontSize.sm[1].lineHeight)*var(--tw-rows,4))]",
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
        "peer-placeholder-shown:top-3.5",
        error ? "text-red-500" : "text-zinc-500",
        error ? "peer-focus:text-red-500" : "peer-focus:text-red-800",
        "peer-focus:top-0",
    ].join(" ");

    return (
        <div className="w-full">
            <div className="relative">
                <textarea
                    id={id}
                    name={name}
                    rows={rows}
                    disabled={disabled}
                    placeholder=" "
                    className={textareaClasses}
                    style={{ "--tw-rows": rows } as React.CSSProperties}
                    {...props}
                />
                <label htmlFor={id} className={labelClasses}>
                    {label}
                </label>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default DescriptionField;
