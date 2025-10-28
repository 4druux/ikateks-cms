interface BadgeProps {
    imageSrc: string;
    altText: string;
}

export default function Badge({ imageSrc, altText }: BadgeProps) {
    return (
        <>
            <img
                src="./images/icp.png"
                alt="icp logo"
                className="z-10 absolute top-5 left-10 w-16"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-300 via-white to-white"></div>

            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: "url('./images/geometric-pattern.svg')",
                    backgroundSize: "cover",
                }}
            ></div>

            <img
                src={imageSrc}
                alt={altText}
                className="max-w-lg w-full z-10 drop-shadow-md"
            />
        </>
    );
}
