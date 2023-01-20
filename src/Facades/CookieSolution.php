<?php

namespace Keepsuit\CookieSolution\Facades;

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\HtmlString;
use Keepsuit\CookieSolution\Service;

/**
 * @method static bool enabled()
 * @method static array getConfig()
 * @method static Service[] services()
 * @method static array servicesGroupedByCookiePurpose()
 * @method static HtmlString script()
 * @method static HtmlString cookiePolicyHtml()
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
