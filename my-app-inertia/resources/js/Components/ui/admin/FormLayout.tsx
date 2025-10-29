import React, { FormEvent } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Button from "@/Components/common/Button";

interface FormLayoutProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    isMutating: boolean;
    submitText: string;
    mutatingText?: string;
    backHref: string;
    children: React.ReactNode;
}

const FormLayout: React.FC<FormLayoutProps> = ({
    onSubmit,
    isMutating,
    submitText,
    mutatingText = "Saving...", 
    backHref,
    children,
}) => {
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4 md:gap-6">
            {children}

            <div className="flex justify-end gap-4 mt-4">
                <Button
                    as="link"
                    variant="outline"
                    size={"md"}
                    href={backHref}
                    iconLeft={<ArrowLeft className="h-5 w-5" />}
                    disabled={isMutating}
                >
                    Back
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    size={"md"}
                    disabled={isMutating}
                    iconLeft={
                        isMutating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )
                    }
                >
                    {isMutating ? mutatingText : submitText}
                </Button>
            </div>
        </form>
    );
};

export default FormLayout;
