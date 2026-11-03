<?php

use Illuminate\Support\HtmlString;
use Keepsuit\CookieSolution\Facades\CookieSolution;
use Keepsuit\CookieSolution\Policy;

it('replaces the policy file with the resolved text', function () {
    CookieSolution::resolvePolicyTextUsing(fn (Policy $policy, string $locale) => new HtmlString("<p>{$policy->value} {$locale}</p>"));

    expect(CookieSolution::cookiePolicyHtml()->toHtml())->toBe('<p>cookie en</p>')
        ->and(CookieSolution::privacyPolicyHtml()->toHtml())->toBe('<p>privacy en</p>');
});

it('renders a resolved Markdown string like the policy files', function () {
    CookieSolution::resolvePolicyTextUsing(fn () => '# Title');

    expect(CookieSolution::cookiePolicyHtml()->toHtml())->toContain('<h1 part="headings h1">Title</h1>');
});

it('falls back to the policy files when the resolved text is null or blank', function (?string $text) {
    CookieSolution::resolvePolicyTextUsing(fn () => $text);

    expect(CookieSolution::cookiePolicyHtml()->toHtml())->toContain('<h2 part="headings h2">What are cookies?</h2>');
})->with([null, '', '  ']);

it('hides the policy file with an empty Htmlable', function () {
    CookieSolution::resolvePolicyTextUsing(fn () => new HtmlString(''));

    expect(CookieSolution::cookiePolicyHtml()->toHtml())->toBe('');
});

it('falls back to the en text of the resolver when the locale has neither a text nor a file', function () {
    $calls = [];
    CookieSolution::resolvePolicyTextUsing(function (Policy $policy, string $locale) use (&$calls) {
        $calls[] = [$policy, $locale];

        return $locale === 'en' ? 'English' : null;
    });
    app()->setLocale('xx');

    expect(CookieSolution::privacyPolicyHtml()->toHtml())->toContain('English')
        ->and($calls)->toBe([[Policy::PRIVACY, 'xx'], [Policy::PRIVACY, 'en']]);
});

it('uses the resolved text in the banner content', function () {
    CookieSolution::getContent();
    CookieSolution::resolvePolicyTextUsing(fn () => new HtmlString('<p>Resolved</p>'));

    expect(CookieSolution::getContent()['texts']['information_text'])->toBe('<p>Resolved</p>');
});
