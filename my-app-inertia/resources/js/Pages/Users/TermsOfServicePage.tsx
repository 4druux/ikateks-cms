import Hero from "@/Components/ui/users/Hero";
import Tagline from "@/Components/about/Tagline";
import ContactSection from "@/Components/contact/ContactContent";

const TermsOfServicePage = () => {
    return (
        <div className="min-h-screen bg-zinc-50">
            <Hero
                imageSrc="/images/terms.jpg"
                title="Terms of Service"
                description="ICP - Driving Excellence, Conquering Challenges, Capturing Opportunity. We are committed to being a trusted partner that propels your business to new heights."
            />
            <ContactSection />
            <Tagline />
        </div>
    );
};

export default TermsOfServicePage;
