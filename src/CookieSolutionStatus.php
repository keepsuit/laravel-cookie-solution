<?php

namespace Keepsuit\CookieSolution;

use Carbon\Carbon;

final class CookieSolutionStatus
{
    public function __construct(
        public readonly Carbon $timestamp,
        /**
         * @var array<string, bool>
         */
        protected readonly array $purposes = [],
    ) {}

    public static function default(): CookieSolutionStatus
    {
        return new CookieSolutionStatus(Carbon::now());
    }

    public function purposeStatus(CookiePurpose $purpose): ?bool
    {
        return $this->purposes[$purpose->value] ?? null;
    }

    public function accepted(CookiePurpose $purpose): bool
    {
        return $this->purposeStatus($purpose) === true;
    }

    public function refused(CookiePurpose $purpose): bool
    {
        return $this->purposeStatus($purpose) === false;
    }
}
