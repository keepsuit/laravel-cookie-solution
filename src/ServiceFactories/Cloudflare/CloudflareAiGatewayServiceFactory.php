<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Cloudflare;

use Keepsuit\CookieSolution\DataProcessingArea;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class CloudflareAiGatewayServiceFactory extends ServiceFactory
{
    public function build(): Service
    {
        return new Service(
            name: 'Cloudflare AI Gateway',
            provider: 'Cloudflare, Inc.',
            description: __('cookie-solution::services.cloudflare_ai_gateway.description'),
            privacyPolicyUrl: 'https://www.cloudflare.com/privacypolicy/',
            dataProcessingLocation: DataProcessingArea::WORLDWIDE->label(),
        );
    }
}
