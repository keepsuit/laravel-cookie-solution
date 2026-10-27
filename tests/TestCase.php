<?php

namespace Keepsuit\CookieSolution\Tests;

use Keepsuit\CookieSolution\CookieSolutionServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;

class TestCase extends Orchestra
{
    protected function getPackageProviders($app)
    {
        return [
            CookieSolutionServiceProvider::class,
        ];
    }
}
