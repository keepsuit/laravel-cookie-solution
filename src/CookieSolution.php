<?php

namespace Keepsuit\CookieSolution;

use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;
use Illuminate\Validation\ValidationException;
use Keepsuit\CookieSolution\Contracts\MarkdownParser;

class CookieSolution
{
    /**
     * @var Service[]
     */
    protected array $services = [];

    protected array $markdownConfig = [
        'html_input' => 'escape',
        'allow_unsafe_links' => false,
    ];

    protected ?CookieSolutionStatus $status = null;

    /**
     * @var array<string, array>
     */
    protected array $content = [];

    /**
     * @var (Closure(Policy, string): (Htmlable|string|null))|null
     */
    protected ?Closure $policyTextResolver = null;

    public function __construct(
        protected MarkdownParser $markdown
    ) {}

    public function enabled(): bool
    {
        return config('cookie-solution.enabled', true);
    }

    /**
     * @return 'light'|'dark'|'auto'
     */
    public function colorScheme(): string
    {
        $colorScheme = config('cookie-solution.color_scheme');

        return in_array($colorScheme, ['dark', 'auto'], true) ? $colorScheme : 'light';
    }

    public function status(): CookieSolutionStatus
    {
        if ($this->status !== null) {
            return $this->status;
        }

        $json = \Illuminate\Support\Facades\Cookie::get(config('cookie-solution.cookie_name'));

        if (! is_string($json)) {
            return $this->status = CookieSolutionStatus::default();
        }

        try {
            $value = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
        } catch (\Throwable) {
            return $this->status = CookieSolutionStatus::default();
        }

        if (! is_array($value)) {
            return $this->status = CookieSolutionStatus::default();
        }

        try {
            $validator = Validator::make($value, [
                'digest' => ['required', 'string'],
                'timestamp' => ['required', 'date'],
                'purposes' => ['required', 'array'],
                'purposes.*' => ['required', 'boolean'],
            ]);

            /**
             * @var array{
             *    digest: string,
             *    timestamp: string,
             *    purposes: array<string, bool>
             * } $validated
             */
            $validated = $validator->validated();

            if ($this->configDigest() !== $validated['digest']) {
                return $this->status = CookieSolutionStatus::default();
            }

            return $this->status = new CookieSolutionStatus(
                timestamp: Carbon::parse($validated['timestamp']),
                purposes: collect($validated['purposes'])
                    ->filter(fn (bool $active, string $key) => CookiePurpose::tryFrom($key) !== null)
                    ->all(),
            );
        } catch (ValidationException) {
            return $this->status = CookieSolutionStatus::default();
        }
    }

    /**
     * @return Collection<array-key,Service>
     */
    public function services(): Collection
    {
        return Collection::make($this->services);
    }

    public function hasCookies(): bool
    {
        return $this->services()
            ->reduce(fn (bool $hasCookies, Service $service) => $hasCookies || count($service->cookies) > 0, false);
    }

    public function hasServices(): bool
    {
        return $this->services()->isNotEmpty();
    }

    public function hasDataOwner(): bool
    {
        return config('cookie-solution.data_owner.name_and_address') !== null;
    }

    /**
     * @return Collection<string,Collection<array-key,Service>>
     */
    public function servicesGroupedByCookiePurpose(): Collection
    {
        return Collection::make([
            CookiePurpose::NECESSARY->value => $this->getCookiesConfigForPurpose(CookiePurpose::NECESSARY),
            CookiePurpose::PREFERENCES->value => $this->getCookiesConfigForPurpose(CookiePurpose::PREFERENCES),
            CookiePurpose::STATISTICS->value => $this->getCookiesConfigForPurpose(CookiePurpose::STATISTICS),
            CookiePurpose::MARKETING->value => $this->getCookiesConfigForPurpose(CookiePurpose::MARKETING),
        ]);
    }

    /**
     * Config needed on every page: the banner content is loaded from `content_url` only when the banner opens.
     */
    public function getConfig(): array
    {
        $locale = app()->getLocale();

        return [
            'enabled' => $this->enabled(),
            'locale' => $locale,
            'digest' => $this->configDigest(),
            'cookie_name' => config('cookie-solution.cookie_name'),
            'cookie_lifetime' => config('cookie-solution.cookie_lifetime'),
            'layout' => config('cookie-solution.layout') === 'floating' ? 'floating' : 'modal',
            'color_scheme' => $this->colorScheme(),
            'highlight_color' => config('cookie-solution.highlight_color'),
            'toggle_enabled' => config('cookie-solution.toggle_enabled', true),
            'toggle_position' => config('cookie-solution.toggle_position', 'right'),
            'toggle_label' => __('cookie-solution::texts.banner.button_show_banner'),
            'content_url' => route('cookie-solution.content', ['locale' => $locale, 'v' => $this->contentVersion()]),
        ];
    }

    /**
     * Texts and services shown by the banner, in the current locale.
     */
    public function getContent(): array
    {
        return $this->content[app()->getLocale()] ??= [
            'texts' => [
                'tab_consent' => __('cookie-solution::texts.banner.tab_consent'),
                'tab_customize' => __('cookie-solution::texts.banner.tab_customize'),
                'tab_information' => __('cookie-solution::texts.banner.tab_information'),
                'button_accept_all' => __('cookie-solution::texts.banner.button_accept_all'),
                'button_accept_selected' => __('cookie-solution::texts.banner.button_accept_selected'),
                'button_refuse' => __('cookie-solution::texts.banner.button_refuse'),
                'button_customize' => __('cookie-solution::texts.banner.button_customize'),
                'consent_title' => __('cookie-solution::texts.banner.consent_title'),
                'consent_message' => __('cookie-solution::texts.banner.consent_message'),
                'customize_purpose_necessary' => __('cookie-solution::texts.cookie_policy.purpose_necessary'),
                'customize_purpose_necessary_description' => __('cookie-solution::texts.cookie_policy.purpose_necessary_description'),
                'customize_purpose_preferences' => __('cookie-solution::texts.cookie_policy.purpose_preferences'),
                'customize_purpose_preferences_description' => __('cookie-solution::texts.cookie_policy.purpose_preferences_description'),
                'customize_purpose_statistics' => __('cookie-solution::texts.cookie_policy.purpose_statistics'),
                'customize_purpose_statistics_description' => __('cookie-solution::texts.cookie_policy.purpose_statistics_description'),
                'customize_purpose_marketing' => __('cookie-solution::texts.cookie_policy.purpose_marketing'),
                'customize_purpose_marketing_description' => __('cookie-solution::texts.cookie_policy.purpose_marketing_description'),
                'information_text' => $this->cookiePolicyHtml()->toHtml(),
                'duration_session' => __('cookie-solution::texts.cookie_policy.duration_session'),
            ],
            'services' => $this->servicesGroupedByCookiePurpose()->toArray(),
        ];
    }

    public function contentVersion(): string
    {
        return hash('xxh128', json_encode($this->getContent(), JSON_THROW_ON_ERROR));
    }

    public function register(Service $service): self
    {
        $this->services[] = $service;
        $this->content = [];

        return $this;
    }

    /**
     * Resolves the policy texts before the Markdown files; an `Htmlable` is printed as is, null falls back to the files.
     *
     * @param  (Closure(Policy, string): (Htmlable|string|null))|null  $resolver
     */
    public function resolvePolicyTextUsing(?Closure $resolver): self
    {
        $this->policyTextResolver = $resolver;
        $this->content = [];

        return $this;
    }

    /**
     * @return Collection<array-key,Service>
     */
    protected function getCookiesConfigForPurpose(CookiePurpose $cookiePurpose): Collection
    {
        return Collection::make($this->services)
            ->map(function (Service $service) use ($cookiePurpose) {
                $cookies = Collection::make($service->cookies)
                    ->filter(fn (Cookie $cookie) => $cookie->purpose === $cookiePurpose)
                    ->values()
                    ->all();

                return $service->cloneWithCookies($cookies);
            })
            ->filter(fn (Service $service) => count($service->cookies) > 0)
            ->values();
    }

    public function script(): HtmlString
    {
        return new HtmlString(view('cookie-solution::script')->render());
    }

    protected function policyText(Policy $policy, string $locale): ?HtmlString
    {
        $text = $this->policyTextResolver !== null ? ($this->policyTextResolver)($policy, $locale) : null;

        if ($text instanceof Htmlable) {
            return new HtmlString($text->toHtml());
        }

        if (is_string($text) && ! blank($text)) {
            return $this->markdown->parse($text);
        }

        $paths = [
            resource_path(sprintf('views/vendor/cookie-solution/policy/%s-policy.%s.md', $policy->value, $locale)),
            __DIR__.sprintf('/../resources/views/policy/%s-policy.%s.md', $policy->value, $locale),
        ];

        foreach ($paths as $path) {
            if (! File::exists($path)) {
                continue;
            }

            try {
                return $this->renderMarkdownFile($path);
            } catch (FileNotFoundException) {
                continue;
            }
        }

        return null;
    }

    public function cookiePolicyHtml(): HtmlString
    {
        return $this->policyHtml(Policy::COOKIE);
    }

    public function privacyPolicyHtml(): HtmlString
    {
        return $this->policyHtml(Policy::PRIVACY);
    }

    protected function policyHtml(Policy $policy): HtmlString
    {
        return $this->policyText($policy, app()->getLocale())
            ?? $this->policyText($policy, 'en')
            ?? new HtmlString('');
    }

    public function dataOwnerHtml(): HtmlString
    {
        $nameAndAddress = config('cookie-solution.data_owner.name_and_address', '');

        $html = match (true) {
            $nameAndAddress instanceof Htmlable => $nameAndAddress->toHtml(),
            default => Str::markdown((string) $nameAndAddress, array_merge($this->markdownConfig, [
                'renderer' => [
                    'soft_break' => '<br>',
                ],
            ])),
        };

        return Str::of($html)
            ->when(config('cookie-solution.data_owner.contact_email'), function (Stringable $string, string $email) {
                $contactEmail = Str::of(sprintf('__%s__ %s', __('cookie-solution::texts.privacy_policy.data_processing_owner_email'), $email))
                    ->markdown($this->markdownConfig);

                return $string->newLine()
                    ->append($contactEmail);
            })
            ->toHtmlString();
    }

    protected function configDigest(): string
    {
        $cookies = $this->services()
            ->flatMap(fn (Service $service) => collect($service->cookies)->map(fn (Cookie $cookie) => Arr::only($cookie->toArray(), ['name', 'purpose', 'duration'])))
            ->toJson();

        return hash('sha256', $cookies);
    }

    /**
     * @throws FileNotFoundException
     */
    protected function renderMarkdownFile(string $sourcePath): HtmlString
    {
        $cachePath = storage_path(sprintf('framework/views/%s.html', hash('xxh128', $sourcePath)));

        if (File::exists($cachePath) && File::lastModified($cachePath) >= File::lastModified($sourcePath)) {
            return new HtmlString(File::get($cachePath));
        }

        $content = $this->markdown->parse(File::get($sourcePath));

        File::ensureDirectoryExists(dirname($cachePath));
        File::put($cachePath, $content);

        return $content;
    }
}
