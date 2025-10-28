export default function AuthHeader() {
    return (
        <div className="fixed top-4 sm:top-10 w-full max-w-md px-4 md:px-0 z-10">
            <div className="flex flex-col items-start gap-2">
                <div className="block sm:hidden">
                    <img
                        src="./images/icp.png"
                        alt="icp logo"
                        className="w-16"
                    />
                </div>

                <div className="flex flex-col items-start">
                    <h2 className="text-md font-medium text-gray-800">
                        PT. Ikateks Citra Persada - CMS Company Profile
                    </h2>
                </div>
            </div>
            <hr className="my-4" />
        </div>
    );
}
