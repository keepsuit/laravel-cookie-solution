<?php

namespace Keepsuit\CookieSolution\Controllers;

use Carbon\Carbon;
use Keepsuit\CookieSolution\CookieSolutionAssets;

class ScriptController
{
    public function __invoke(CookieSolutionAssets $script): mixed
    {
        $file = $script->getScriptFilePath();
        $mimeType = 'application/javascript';

        $expires = Carbon::now()->addYear()->timestamp;
        $lastModified = filemtime($file);
        $cacheControl = 'public, max-age=31536000';

        if ($this->matchesCache($lastModified)) {
            return response('', 304, [
                'Expires' => $this->httpDate($expires),
                'Cache-Control' => $cacheControl,
            ]);
        }

        return response()->file($file, [
            'Content-Type' => sprintf('%s; charset=utf-8', $mimeType),
            'Expires' => $this->httpDate($expires),
            'Cache-Control' => $cacheControl,
            'Last-Modified' => $this->httpDate($lastModified),
        ]);
    }

    protected function matchesCache(int $lastModified): bool
    {
        $ifModifiedSince = $_SERVER['HTTP_IF_MODIFIED_SINCE'] ?? '';

        return strtotime($ifModifiedSince) === $lastModified;
    }

    protected function httpDate(int $timestamp): string
    {
        return sprintf('%s GMT', gmdate('D, d M Y H:i:s', $timestamp));
    }
}
