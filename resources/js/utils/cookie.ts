import type { CookiePurpose, CookieSolutionConfig, CookieSolutionStatus } from '../types';

export function setCookie(name: string, value: string, expireInDays: number, domain?: string | null): void {
    const expiresAt = new Date(Date.now() + expireInDays * 24 * 60 * 60 * 1000);
    const secure = document.location.protocol === 'https:';

    document.cookie = `${name}=${encodeURIComponent(
        value,
    )}; expires=${expiresAt.toUTCString()}; path=/; samesite=lax${domain ? `; domain=${domain}` : ''}${secure ? '; secure' : ''}`;
}

export function readCookie(name: string): string | undefined {
    const cookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith(`${name}=`));

    if (!cookie) {
        return undefined;
    }

    const value = cookie.split('=')[1];

    return decodeURIComponent(value);
}

export function deleteCookie(name: string, domain?: string | null): void {
    setCookie(name, '', -1);

    if (domain) {
        setCookie(name, '', -1, domain);
    }
}

export function readStatus(
    config: Pick<CookieSolutionConfig, 'cookie_name' | 'digest'>,
): CookieSolutionStatus | undefined {
    const value = readCookie(config.cookie_name);

    if (!value) {
        return undefined;
    }

    try {
        const status = JSON.parse(value);
        const purposes = status?.purposes;

        if (
            status?.digest !== config.digest ||
            typeof purposes !== 'object' ||
            purposes === null ||
            !Object.values(purposes).every((value) => typeof value === 'boolean')
        ) {
            return undefined;
        }

        return status;
    } catch {
        return undefined;
    }
}

export function writeStatus(config: CookieSolutionConfig, status: CookieSolutionStatus): void {
    if (config.cookie_domain) {
        // A host-only cookie from before the domain was set would be read first.
        deleteCookie(config.cookie_name);
    }

    setCookie(
        config.cookie_name,
        JSON.stringify({ ...status, digest: config.digest }),
        config.cookie_lifetime,
        config.cookie_domain,
    );
}

export function newEmptyStatus(): CookieSolutionStatus {
    return {
        timestamp: new Date().toISOString(),
        purposes: {
            necessary: true,
            preferences: false,
            statistics: false,
            marketing: false,
        },
    };
}

export function samePurposes(a: CookieSolutionStatus, b: CookieSolutionStatus): boolean {
    return (Object.keys(a.purposes) as CookiePurpose[]).every((purpose) => a.purposes[purpose] === b.purposes[purpose]);
}
