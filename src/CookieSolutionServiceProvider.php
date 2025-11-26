<?php

namespace Keepsuit\CookieSolution;

use Illuminate\Cookie\Middleware\EncryptCookies;
use Keepsuit\CookieSolution\Contracts\MarkdownParser;
use Keepsuit\CookieSolution\Support\DefaultMarkdownParser;
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
            ->hasViews()
            ->hasViewComposer('cookie-solution::script', Views\ScriptViewComposer::class)
            ->hasAssets()
            ->hasRoute('routes');
    }

    public function packageRegistered(): void
    {
        $this->app->singleton(CookieSolution::class);
        $this->app->singleton(CookieSolutionAssets::class);
        $this->app->bind(MarkdownParser::class, DefaultMarkdownParser::class);

        $this->app->resolving(EncryptCookies::class, function (EncryptCookies $encryptCookies) {
            $encryptCookies->disableFor(config('cookie-solution.cookie_name'));
        });
    }
}
