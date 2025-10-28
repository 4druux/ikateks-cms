import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.{js,jsx,ts,tsx}",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Roboto-Regular", ...defaultTheme.fontFamily.sans],
                geometos: ["Geometos", "sans-serif"],
                "roboto-light": ["Roboto-Light", "sans-serif"],
                "roboto-medium": ["Roboto-Medium", "sans-serif"],
            },
            animation: {
                "scroll-infinite": "scroll 30s linear infinite",
            },
            keyframes: {
                scroll: {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-50%)" },
                },
            },
        },
    },

    plugins: [forms],
};
