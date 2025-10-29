import React from "react";
import { AlertTriangle } from "lucide-react";

interface DataNotFoundProps {
    title: string;
    message: string;
}

const DataNotFound: React.FC<DataNotFoundProps> = ({ title, message }) => {
    return (
        <div className="flex flex-col items-center justify-center p-4 py-20 space-y-2">
            <AlertTriangle className="w-12 h-12 mx-auto text-red-900" />
            <h3 className="mt-2 text-lg font-medium text-zinc-700">{title}</h3>
            <p className="px-4 text-sm text-center text-zinc-500">{message}</p>
        </div>
    );
};

export default DataNotFound;
