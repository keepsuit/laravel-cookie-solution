<?php

use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\CookieSolutionStatus;
use Keepsuit\CookieSolution\Facades\CookieSolution;

test('status helper methods', function () {
    $status = new CookieSolutionStatus(
        timestamp: now(),
        purposes: [
            'statistics' => true,
            'marketing' => false,
        ]
    );

    expect($status)
        ->purposeStatus(CookiePurpose::STATISTICS)->toBeTrue()
        ->accepted(CookiePurpose::STATISTICS)->toBeTrue()
        ->refused(CookiePurpose::STATISTICS)->toBeFalse();

    expect($status)
        ->purposeStatus(CookiePurpose::MARKETING)->toBeFalse()
        ->accepted(CookiePurpose::MARKETING)->toBeFalse()
        ->refused(CookiePurpose::MARKETING)->toBeTrue();

    expect($status)
        ->purposeStatus(CookiePurpose::NECESSARY)->toBeNull()
        ->accepted(CookiePurpose::NECESSARY)->toBeFalse()
        ->refused(CookiePurpose::NECESSARY)->toBeFalse();
});

it('set default status when cookie not set', function () {
    $status = CookieSolution::status();

    expect($status)
        ->toBeInstanceOf(CookieSolutionStatus::class)
        ->purposeStatus(CookiePurpose::STATISTICS)->toBeNull()
        ->purposeStatus(CookiePurpose::NECESSARY)->toBeNull()
        ->purposeStatus(CookiePurpose::PREFERENCES)->toBeNull()
        ->purposeStatus(CookiePurpose::MARKETING)->toBeNull();
});

it('load status from cookie when set', function () {
    $request = app('request');
    assert($request instanceof \Illuminate\Http\Request);
    $request->cookies->set('laravel_cookie_solution', json_encode([
        'timestamp' => now()->toIso8601String(),
        'purposes' => [
            'statistics' => true,
            'marketing' => false,
        ],
    ]));

    $status = CookieSolution::status();

    expect($status)
        ->toBeInstanceOf(CookieSolutionStatus::class)
        ->accepted(CookiePurpose::STATISTICS)->toBeTrue()
        ->accepted(CookiePurpose::MARKETING)->toBeFalse()
        ->purposeStatus(CookiePurpose::NECESSARY)->toBeNull()
        ->purposeStatus(CookiePurpose::PREFERENCES)->toBeNull();
});
