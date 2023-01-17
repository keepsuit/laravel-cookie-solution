<?php

namespace Keepsuit\CookieSolution;

interface Service
{
    /**
     * Service provider name
     */
    public function provider(): string;

    /**
     * Cookies controlled by this service
     *
     * @return Cookie[]
     */
    public function cookies(): array;
}