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
        'digest' => CookieSolution::getConfig()['digest'],
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

it('load default status when config digest is changed', function () {
    $request = app('request');
    assert($request instanceof \Illuminate\Http\Request);
    $request->cookies->set('laravel_cookie_solution', json_encode([
        'timestamp' => now()->toIso8601String(),
        'digest' => 'old-digest',
        'purposes' => [
            'statistics' => true,
            'marketing' => false,
        ],
    ]));

    $status = CookieSolution::status();

    expect($status)
        ->toBeInstanceOf(CookieSolutionStatus::class)
        ->purposeStatus(CookiePurpose::STATISTICS)->toBeNull()
        ->purposeStatus(CookiePurpose::MARKETING)->toBeNull()
        ->purposeStatus(CookiePurpose::NECESSARY)->toBeNull()
        ->purposeStatus(CookiePurpose::PREFERENCES)->toBeNull();
});

it('load default status when config date is malformed', function () {
    \Spatie\TestTime\TestTime::freeze();

    $request = app('request');
    assert($request instanceof \Illuminate\Http\Request);
    $request->cookies->set('laravel_cookie_solution', json_encode([
        'timestamp' => sprintf('%s<script>alert(1)</script>', now()->subHour()->toIso8601String()),
        'digest' => CookieSolution::getConfig()['digest'],
        'purposes' => [
            'statistics' => true,
            'marketing' => false,
        ],
    ]));

    $status = CookieSolution::status();

    expect($status)
        ->toBeInstanceOf(CookieSolutionStatus::class)
        ->timestamp->toIso8601String()->toBe(now()->toIso8601String())
        ->purposeStatus(CookiePurpose::STATISTICS)->toBeNull()
        ->purposeStatus(CookiePurpose::MARKETING)->toBeNull()
        ->purposeStatus(CookiePurpose::NECESSARY)->toBeNull()
        ->purposeStatus(CookiePurpose::PREFERENCES)->toBeNull();
});

it('load default status when config purposes are malformed', function () {
    \Spatie\TestTime\TestTime::freeze();

    $request = app('request');
    assert($request instanceof \Illuminate\Http\Request);
    $request->cookies->set('laravel_cookie_solution', json_encode([
        'timestamp' => now()->subHour()->toIso8601String(),
        'digest' => CookieSolution::getConfig()['digest'],
        'purposes' => [
            'statistics' => true,
            'marketing' => 'invalid',
        ],
    ]));

    $status = CookieSolution::status();

    expect($status)
        ->toBeInstanceOf(CookieSolutionStatus::class)
        ->timestamp->toIso8601String()->toBe(now()->toIso8601String())
        ->purposeStatus(CookiePurpose::STATISTICS)->toBeNull()
        ->purposeStatus(CookiePurpose::MARKETING)->toBeNull()
        ->purposeStatus(CookiePurpose::NECESSARY)->toBeNull()
        ->purposeStatus(CookiePurpose::PREFERENCES)->toBeNull();
});
