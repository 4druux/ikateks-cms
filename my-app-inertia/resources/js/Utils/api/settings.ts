import axios from "axios";

export interface SocialLink {
    name: string;
    href: string;
    icon_name: string;
}

export interface SettingsData {
    id: number;
    footer_description: string | null;
    footer_description_id: string | null;
    contact_phone_number: string | null;
    contact_phone_href: string | null;
    contact_email: string | null;
    location_address: string | null;
    location_address_id: string | null;
    location_href: string | null;
    company_name: string | null;
    copyright_text: string | null;
    copyright_text_id: string | null;
    social_links: SocialLink[] | null;
    created_at: string;
    updated_at: string;
}

export const getSettings = async (): Promise<SettingsData> => {
    const response = await axios.get("/api/admin/settings");
    return response.data;
};

export const updateSettings = async (
    data: Partial<SettingsData>
): Promise<SettingsData> => {
    const response = await axios.post("/api/admin/settings", data);
    return response.data;
};
