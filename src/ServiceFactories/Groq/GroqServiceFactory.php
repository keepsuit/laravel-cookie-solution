<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Groq;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;
use Symfony\Component\Intl\Countries;

class GroqServiceFactory extends ServiceFactory
{
    protected GroqEntity $entity = GroqEntity::USA;

    public function entity(GroqEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Groq',
            provider: $this->entity->provider(),
            description: __('cookie-solution::services.groq.description'),
            privacyPolicyUrl: 'https://groq.com/privacy-policy',
            dataProcessingLocation: Countries::getName('US', app()->getLocale()),
        );
    }
}
