<?php

namespace Keepsuit\CookieSolution;

class CookieSolutionAssets
{
    const SCRIPT_FILENAME = 'laravel-cookie-solution.mjs';

    protected ?array $manifest = null;

    protected bool $usePublishedAssets;

    public function __construct()
    {
        $this->usePublishedAssets = file_exists(public_path('vendor/cookie-solution/manifest.json'));
    }

    protected function getManifest(): array
    {
        if ($this->manifest === null) {
            $this->manifest = json_decode(file_get_contents($this->getAssetPath('manifest.json')), true, JSON_THROW_ON_ERROR);
        }

        return $this->manifest;
    }

    public function getScriptUrl(): string
    {
        $versionedScript = $this->getManifest()[self::SCRIPT_FILENAME];

        if ($this->usePublishedAssets) {
            return asset('vendor/cookie-solution/'.$versionedScript);
        }

        return sprintf('/cookie-solution/%s', $versionedScript);
    }

    public function getScriptFilePath(): string
    {
        return $this->getAssetPath(self::SCRIPT_FILENAME);
    }

    protected function getAssetPath(string $asset): string
    {
        if ($this->usePublishedAssets) {
            return public_path('vendor/cookie-solution/'.$asset);
        }

        return __DIR__.'/../resources/dist/'.$asset;
    }
}
