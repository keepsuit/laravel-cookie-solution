<?php

namespace Keepsuit\CookieSolution;

use Illuminate\Support\Str;

class CookieSolutionAssets
{
    protected ?array $manifest = null;

    protected function getManifest(): array
    {
        if ($this->manifest === null) {
            $this->manifest = json_decode(file_get_contents(__DIR__.'/../dist/manifest.json'), true, JSON_THROW_ON_ERROR);
        }

        return $this->manifest;
    }

    public function getScriptUrl(): string
    {
        $version = Str::of($this->getScriptFileName())
            ->beforeLast('.')
            ->explode('-')
            ->last();

        return sprintf('/cookie-solution/laravel-cookie-solution.js?id=%s', $version);
    }

    public function getScriptFilePath(): string
    {
        return __DIR__.'/../dist/'.$this->getScriptFileName();
    }

    protected function getScriptFileName(): string
    {
        $manifest = $this->getManifest();

        $asset = $manifest['resources/js/laravel-cookie-solution.ts'];

        return $asset['file'];
    }
}
