import type { CookieSolutionConfig, CookieSolutionContent } from '../types';

const requests = new Map<string, Promise<CookieSolutionContent>>();

export function fetchContent(config: CookieSolutionConfig): Promise<CookieSolutionContent> {
    let request = requests.get(config.content_url);

    if (!request) {
        request = fetch(config.content_url).then((response) => {
            if (!response.ok) {
                throw new Error(`Content request failed with status ${response.status}`);
            }

            return response.json();
        });
        // A failed request is retried the next time the banner opens.
        request.catch(() => requests.delete(config.content_url));
        requests.set(config.content_url, request);
    }

    return request;
}
