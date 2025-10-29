import { ArrowUpRight } from "lucide-react";

interface CallToActionProps {
  title?: string;
  linkText?: string;
}

const CallToAction = ({
  title = "Ready to Transform Your Business?",
  linkText = "Let's discuss with us",
}: CallToActionProps) => {
  return (
    <section className="mt-10 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-28 bg-zinc-950 text-white p-8 text-center">
      <div className="flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 mt-0 md:mt-4 xl:mt-20">
        <h2 className="roboto-medium text-4xl md:text-5xl font-bold mb-2 md:mb-4">
          {title}
        </h2>
        <a
          href="/contact"
          className="flex items-center gap-1 text-lg md:text-xl mb-8 text-zinc-400 hover:text-white underline group"
        >
          {linkText}
          <span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-1 transition-transform duration-300 ease-in-out" />
          </span>
        </a>
      </div>
    </section>
  );
};

export default CallToAction;
