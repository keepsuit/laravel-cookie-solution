<?php

namespace Keepsuit\CookieSolution\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \Keepsuit\CookieSolution\CookieSolution
 */
class CookieSolution extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \Keepsuit\CookieSolution\CookieSolution::class;
    }
}
