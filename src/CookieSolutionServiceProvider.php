<?php

namespace Keepsuit\CookieSolution;

use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class CookieSolutionServiceProvider extends PackageServiceProvider
{
    public function configurePackage(Package $package): void
    {
        $package
            ->name('laravel-cookie-solution')
            ->hasConfigFile()
            ->hasTranslations()
            ->hasViews();
    }
}
