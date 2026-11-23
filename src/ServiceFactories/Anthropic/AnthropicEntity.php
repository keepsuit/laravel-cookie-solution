<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Anthropic;

enum AnthropicEntity
{
    case USA;
    case IRELAND;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'Anthropic, PBC',
            self::IRELAND => 'Anthropic Ireland, Limited',
        };
    }
}
