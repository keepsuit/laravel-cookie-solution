<?php

namespace Keepsuit\CookieSolution\Services\Amazon;

use Keepsuit\CookieSolution\Service;

class AmazonWebServices implements Service
{
    public function __construct(
        protected AmazonWebServicesLocation $location,
    ) {
    }

    public function provider(): string
    {
        return 'Amazon Web Services, Inc.';
    }

    public function cookies(): array
    {
        return [];
    }
}
