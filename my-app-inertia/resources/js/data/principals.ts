import {
    Globe,
    Factory,
    Scaling,
    Map,
    Handshake,
    Recycle,
    Workflow,
    Cog,
    LineChart,
} from "lucide-react";
import { ElementType } from "react";

export interface StaticPrincipalsItem {
    id: number;
    icon: ElementType;
    i18nKey: string;
}

export interface TranslatedPrincipalsItem extends StaticPrincipalsItem {
    title: string;
    description: string;
    overviewMethodology: string[];
    keywords: string[];
}

export const principals: StaticPrincipalsItem[] = [
    { id: 1, icon: Globe, i18nKey: "marketEntry" },
    { id: 2, icon: Factory, i18nKey: "feasibilityStudy" },
    { id: 3, icon: Scaling, i18nKey: "competitorIntelligence" },
    { id: 4, icon: Map, i18nKey: "businessPlan" },
    { id: 5, icon: Handshake, i18nKey: "corporateAction" },
    { id: 6, icon: Recycle, i18nKey: "transformation" },
    { id: 7, icon: Workflow, i18nKey: "operationalExcellence" },
    { id: 8, icon: Cog, i18nKey: "implementation" },
    { id: 9, icon: LineChart, i18nKey: "investmentAdvisory" },
];
