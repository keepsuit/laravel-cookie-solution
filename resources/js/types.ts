export type CookiePurpose = 'necessary' | 'preferences' | 'statistics' | 'marketing';

export interface CookieConfig {
    name: string;
    description: string;
    purpose: CookiePurpose;
    /** Duration in days, `0` for session cookies. */
    duration: number;
}

export interface ServiceConfig {
    name: string;
    provider: string;
    description: string;
    privacy_policy_url: string | null;
    data_processing_location: string | null;
    cookies: CookieConfig[];
}

export interface CookieSolutionConfig {
    enabled: boolean;
    locale: string;
    digest: string;
    cookie_name: string;
    cookie_lifetime: number;
    toggle_enabled: boolean;
    toggle_position: 'left' | 'right';
    services: Record<CookiePurpose, ServiceConfig[]>;
    texts: {
        tab_consent: string;
        tab_customize: string;
        tab_information: string;
        button_show_banner: string;
        button_accept_all: string;
        button_accept_selected: string;
        button_refuse: string;
        button_customize: string;
        button_close: string;
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
        duration_session: string;
    };
}

export interface CookieSolutionStatus {
    timestamp: string;
    digest?: string;
    purposes: Record<CookiePurpose, boolean>;
}

/** Response of the `{api.path}/policies` endpoint. */
export interface CookieSolutionPolicies {
    cookie_policy: string;
    privacy_policy: string;
}
