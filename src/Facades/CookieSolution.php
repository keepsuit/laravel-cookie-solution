<?php

namespace Keepsuit\CookieSolution\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static array getConfig()
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
