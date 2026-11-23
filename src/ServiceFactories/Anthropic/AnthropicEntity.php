<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Anthropic;

enum AnthropicEntity
{
    case USA;
    /** Contracting party for EEA, Swiss and UK customers. */
    case IRELAND;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'Anthropic, PBC',
            self::IRELAND => 'Anthropic Ireland, Limited',
        };
    }
}
