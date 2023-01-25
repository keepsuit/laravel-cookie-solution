<?php

namespace Keepsuit\CookieSolution;

use Illuminate\Contracts\Support\Arrayable;

class Service implements Arrayable
{
    public function __construct(
        public readonly string $name,
        public readonly string $provider,
        /**
         * @var Cookie[]
         */
        public readonly array $cookies = []
    ) {
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'provider' => $this->provider,
            'cookies' => array_map(fn (Cookie $cookie) => $cookie->toArray(), $this->cookies),
        ];
    }
}
