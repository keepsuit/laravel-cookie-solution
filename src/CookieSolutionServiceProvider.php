<?php

namespace Keepsuit\CookieSolution;

use Keepsuit\CookieSolution\Commands\CookieSolutionCommand;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class CookieSolutionServiceProvider extends PackageServiceProvider
{
    public function configurePackage(Package $package): void
    {
        /*
         * This class is a Package Service Provider
         *
         * More info: https://github.com/spatie/laravel-package-tools
         */
        $package
            ->name('laravel-cookie-solution')
            ->hasConfigFile()
            ->hasViews()
            ->hasMigration('create_laravel-cookie-solution_table')
            ->hasCommand(CookieSolutionCommand::class);
    }
}
