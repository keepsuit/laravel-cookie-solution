<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Groq;

enum GroqEntity
{
    case USA;
    /** Contracting party for EEA and Swiss customers. */
    case UNITED_KINGDOM;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'Groq LLC',
            self::UNITED_KINGDOM => 'Groq UK Limited',
        };
    }
}
