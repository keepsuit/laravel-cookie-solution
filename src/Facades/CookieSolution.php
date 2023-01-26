<?php

namespace Keepsuit\CookieSolution\Facades;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Facade;
use Illuminate\Support\HtmlString;
use Keepsuit\CookieSolution\Service;

/**
 * @method static bool enabled()
 * @method static array getConfig()
 * @method static Collection<int, Service> services()
 * @method static Collection<string, Collection<string,Collection<array-key,Service>>> servicesGroupedByCookiePurpose()
 * @method static bool hasCookies()
 * @method static bool hasServices()
 * @method static HtmlString script()
 * @method static HtmlString cookiePolicyHtml()
 * @method static HtmlString privacyPolicyHtml()
 * @method static \Keepsuit\CookieSolution\CookieSolution register(\Keepsuit\CookieSolution\Service $service)
 *
 * @see \Keepsuit\CookieSolution\CookieSolution
 */
class CookieSolution extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \Keepsuit\CookieSolution\CookieSolution::class;
    }
}
