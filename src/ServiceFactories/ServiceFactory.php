<?php

namespace Keepsuit\CookieSolution\ServiceFactories;

use Keepsuit\CookieSolution\Service;

abstract class ServiceFactory
{
    public static function new(): static
    {
        return new static;
    }

    abstract public function build(): Service;
}
