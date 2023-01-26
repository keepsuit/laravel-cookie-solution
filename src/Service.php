<?php

namespace Keepsuit\CookieSolution;

use Illuminate\Contracts\Support\Arrayable;

class Service implements Arrayable
{
    public function __construct(
        public readonly string $name,
        public readonly string $provider,
        public readonly string $description,
        public readonly ?string $privacyPolicyUrl = null,
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
            'description' => $this->description,
            'privacy_policy_url' => $this->privacyPolicyUrl,
            'cookies' => array_map(fn (Cookie $cookie) => $cookie->toArray(), $this->cookies),
        ];
    }
}
