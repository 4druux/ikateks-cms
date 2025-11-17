export interface PageHero {
    id: number;
    page_key: string;
    title: string;
    title_id: string;
    subtitle: string;
    subtitle_id: string;
    description: string;
    description_id: string;
    media_type: "image" | "video";
    media_path: string;
    media_url?: string;
}
