<?php

namespace Keepsuit\CookieSolution\Views;

use Illuminate\View\View;
use Keepsuit\CookieSolution\CookieSolution;
use Keepsuit\CookieSolution\CookieSolutionAssets;

class ScriptViewComposer
{
    public function __construct(
        protected CookieSolution $cookieSolution,
        protected CookieSolutionAssets $assets
    ) {}

    public function compose(View $view): void
    {
        $scriptUrl = $this->assets->getScriptUrl();
        $config = $this->cookieSolution->getConfig();

        $view->with([
            'enabled' => $this->cookieSolution->enabled(),
            'highlightColor' => config('cookie-solution.highlight_color'),
            'scriptUrl' => $scriptUrl,
            'config' => $config,
        ]);
    }
}
