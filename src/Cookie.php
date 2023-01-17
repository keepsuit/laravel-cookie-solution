<?php

namespace Keepsuit\CookieSolution;

class Cookie
{
    public function __construct(
        public readonly string $name,
        public readonly CookiePurpose $purpose,
        /**
         * Cookie duration in days.
         * Set to 0 for session cookie.
         */
        public readonly int $duration,
        public readonly string $description,
    ) {
    }
}
