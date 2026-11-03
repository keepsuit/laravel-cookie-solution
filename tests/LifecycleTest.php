<?php

use Illuminate\Support\HtmlString;
use Keepsuit\CookieSolution\CookieSolution;
use Keepsuit\CookieSolution\Facades\CookieSolution as CookieSolutionFacade;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleAnalytics4ServiceFactory;

it('rebuilds the instance after the scope is reset, keeping what afterResolving registers', function () {
    app()->afterResolving(CookieSolution::class, fn (CookieSolution $cookieSolution) => $cookieSolution
        ->register(GoogleAnalytics4ServiceFactory::new()->build())
        ->resolvePolicyTextUsing(fn () => new HtmlString('<p>Resolved</p>')));

    $instance = app(CookieSolution::class);
    $instance->register(GoogleAnalytics4ServiceFactory::new()->build());

    app()->forgetScopedInstances();
    CookieSolutionFacade::clearResolvedInstances();

    expect(app(CookieSolution::class))->not->toBe($instance)
        ->and(CookieSolutionFacade::services())->toHaveCount(1)
        ->and(CookieSolutionFacade::cookiePolicyHtml()->toHtml())->toBe('<p>Resolved</p>');
});
