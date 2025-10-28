import { useState, useEffect, ReactNode } from "react";
import Lenis from "lenis";
import { LenisContext } from "@/Context/LenisContext";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";

export default function GuestLayout({ children }: { children: ReactNode }) {
    const [lenis, setLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        const lenisInstance = new Lenis();
        setLenis(lenisInstance);

        function raf(time: number) {
            lenisInstance.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenisInstance.destroy();
            setLenis(null);
        };
    }, []);

    return (
        <LenisContext.Provider value={lenis}>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
            </div>
        </LenisContext.Provider>
    );
}
