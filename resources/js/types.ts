export type CookiePurpose = 'necessary' | 'preferences' | 'statistics' | 'marketing';

export interface CookieConfig {
    name: string;
    description: string;
    duration: number;
}

export interface ServiceConfig {
    provider: string;
    cookies: CookieConfig[];
}

export interface CookieSolutionConfig {
    cookie_name: string;
    cookie_lifetime: number;
    cookies: Record<CookiePurpose, ServiceConfig>;
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
    };
}
