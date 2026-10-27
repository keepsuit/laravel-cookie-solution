import type { CookieSolutionConfig, CookieSolutionStatus } from '../types';

export function setCookie(name: string, value: string, expireInDays: number): void {
    const expiresAt = new Date(Date.now() + expireInDays * 24 * 60 * 60 * 1000);
    const secure = document.location.protocol === 'https:';

    document.cookie = `${name}=${encodeURIComponent(
        value,
    )}; expires=${expiresAt.toUTCString()}; path=/; samesite=lax; ${secure ? ';secure' : ''}`;
}

export function readCookie(name: string): string | undefined {
    const cookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith(`${name}=`));

    if (!cookie) {
        return undefined;
    }

    const value = cookie.split('=')[1];

    return decodeURIComponent(value);
}

export function deleteCookie(name: string): void {
    setCookie(name, '', -1);
}

export function readStatus(config: CookieSolutionConfig): CookieSolutionStatus | undefined {
    const value = readCookie(config.cookie_name);

    if (!value) {
        return undefined;
    }

    try {
        const status = JSON.parse(value);

        return status?.digest === config.digest && typeof status.purposes === 'object' ? status : undefined;
    } catch {
        return undefined;
    }
}

export function writeStatus(config: CookieSolutionConfig, status: CookieSolutionStatus): void {
    status.digest = config.digest;

    setCookie(config.cookie_name, JSON.stringify(status), config.cookie_lifetime);
}
