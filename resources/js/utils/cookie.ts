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
