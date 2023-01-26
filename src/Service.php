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
        public readonly ?string $dataProcessingLocation = null,
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
            'data_processing_location' => $this->dataProcessingLocation,
            'cookies' => array_map(fn (Cookie $cookie) => $cookie->toArray(), $this->cookies),
        ];
    }

    public function cloneWithCookies(array $cookies): Service
    {
        return new Service(
            name: $this->name,
            provider: $this->provider,
            description: $this->description,
            privacyPolicyUrl: $this->privacyPolicyUrl,
            dataProcessingLocation: $this->dataProcessingLocation,
            cookies: $cookies,
        );
    }
}
