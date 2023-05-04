export type CookiePurpose = 'necessary' | 'preferences' | 'statistics' | 'marketing';

export interface CookieConfig {
    name: string;
    description: string;
    duration: number;
}

export interface ServiceConfig {
    provider: string;
    name: string;
    cookies: CookieConfig[];
}

export interface CookieSolutionConfig {
    digest: string;
    cookie_name: string;
    cookie_lifetime: number;
    toggle_position: 'left' | 'right';
    cookies: Record<CookiePurpose, ServiceConfig[]>;
    texts: {
        tab_consent: string;
        tab_customize: string;
        tab_information: string;
        button_accept_all: string;
        button_accept_selected: string;
        button_refuse: string;
        button_customize: string;
        consent_message: string;
        consent_title: string;
        customize_purpose_necessary: string;
        customize_purpose_necessary_description: string;
        customize_purpose_preferences: string;
        customize_purpose_preferences_description: string;
        customize_purpose_statistics: string;
        customize_purpose_statistics_description: string;
        customize_purpose_marketing: string;
        customize_purpose_marketing_description: string;
        information_text: string;
    };
}
