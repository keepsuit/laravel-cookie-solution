<?php

namespace Keepsuit\CookieSolution\ServiceFactories\OpenAI;

enum OpenAIEntity
{
    case USA;
    /** Contracting party for EEA and Swiss customers. */
    case IRELAND;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'OpenAI OpCo, LLC',
            self::IRELAND => 'OpenAI Ireland Ltd.',
        };
    }

    public function privacyPolicyUrl(): string
    {
        return match ($this) {
            // Served in the version for the reader's country.
            self::USA => 'https://openai.com/policies/privacy-policy/',
            self::IRELAND => 'https://openai.com/policies/eu-privacy-policy/',
        };
    }
}
