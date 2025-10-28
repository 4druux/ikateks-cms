import { ElementType } from "react";
import { Users, Handshake, Globe } from "lucide-react";

export interface companyAdvantageItem {
    id: number;
    icon: ElementType;
    i18nKey: string;
}

export const companyAdvantage: companyAdvantageItem[] = [
    {
        id: 1,
        icon: Users,
        i18nKey: "expertise",
    },
    {
        id: 2,
        icon: Handshake,
        i18nKey: "partnership",
    },
    {
        id: 3,
        icon: Globe,
        i18nKey: "global",
    },
];
