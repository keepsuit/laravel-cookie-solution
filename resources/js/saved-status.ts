import type { CookieSolutionConfig } from './types';
import { readStatus } from './utils/cookie';

// Injected by the wrapper in `savedStatusScript()` and `status.blade.php`.
declare const __cookieSolutionConfig: Pick<CookieSolutionConfig, 'cookie_name' | 'digest'>;

window.cookieSolutionSavedStatus = () => readStatus(__cookieSolutionConfig);
