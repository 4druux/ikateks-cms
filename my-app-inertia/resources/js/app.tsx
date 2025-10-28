import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp, router } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

import "./i18n";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestLayout from "@/Layouts/GuestLayout";
import { ReactElement } from "react";
import { Toaster } from "react-hot-toast";

const BASE_TITLE = "PT Ikateks";

createInertiaApp({
    title: (title) => {
        if (title && title !== BASE_TITLE) {
            return `${title} - ${BASE_TITLE}`;
        }

        return BASE_TITLE;
    },

    resolve: async (name) => {
        const pageModule = (await resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        )) as any;

        const page = pageModule.default;
        if (page && page.layout === undefined) {
            if (name.startsWith("Admin/")) {
                page.layout = (pageComponent: ReactElement) => (
                    <AuthenticatedLayout>{pageComponent}</AuthenticatedLayout>
                );
            } else {
                page.layout = (pageComponent: ReactElement) => (
                    <GuestLayout>{pageComponent}</GuestLayout>
                );
            }
        }
        return pageModule;
    },

    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <>
                <App {...props} />
                <Toaster
                    position="top-right"
                    reverseOrder={true}
                    duration={5000}
                    toastOptions={{ className: "custom-toast" }}
                />
            </>
        );
    },

    progress: {
        color: "#991B1B",
    },
});

router.on("navigate", (event) => {
    const newCsrfToken = event.detail.page.props.csrf_token;
    const csrfMetaTag = document.head.querySelector('meta[name="csrf-token"]');

    if (newCsrfToken && csrfMetaTag) {
        if (csrfMetaTag.getAttribute("content") !== newCsrfToken) {
            csrfMetaTag.setAttribute("content", newCsrfToken);
        }
    }
});
