import { readStatus } from './utils/cookie';

// Injected by the wrapper in `savedStatusScript()` and `status.blade.php`.
declare const __cookieSolutionConfig: { cookie_name: string; digest: string };

window.cookieSolutionSavedStatus = () => readStatus(__cookieSolutionConfig);
