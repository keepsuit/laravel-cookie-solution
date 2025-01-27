<?php

namespace Keepsuit\CookieSolution;

use Illuminate\Contracts\Support\Arrayable;

class Cookie implements Arrayable
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
    ) {}

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'purpose' => $this->purpose->value,
            'duration' => $this->duration,
        ];
    }
}
