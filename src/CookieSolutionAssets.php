<?php

namespace Keepsuit\CookieSolution;

class CookieSolutionAssets
{
    const SCRIPT_FILENAME = 'laravel-cookie-solution.js';

    protected ?array $manifest = null;

    protected function getManifest(): array
    {
        if ($this->manifest === null) {
            $this->manifest = json_decode(file_get_contents($this->getAssetPath('manifest.json')), true, 512, JSON_THROW_ON_ERROR);
        }

        return $this->manifest;
    }

    public function getScriptUrl(): string
    {
        return sprintf('/cookie-solution/%s', $this->getManifest()[self::SCRIPT_FILENAME]);
    }

    public function getScriptFilePath(): string
    {
        return $this->getAssetPath(self::SCRIPT_FILENAME);
    }

    protected function getAssetPath(string $asset): string
    {
        return __DIR__.'/../resources/dist/'.$asset;
    }
}
