<?php

namespace Keepsuit\CookieSolution\Tests;

use Illuminate\Database\Eloquent\Factories\Factory;
use Keepsuit\CookieSolution\CookieSolutionServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;

class TestCase extends Orchestra
{
    protected function setUp(): void
    {
        parent::setUp();

        Factory::guessFactoryNamesUsing(
            fn (string $modelName) => 'Keepsuit\\CookieSolution\\Database\\Factories\\'.class_basename($modelName).'Factory'
        );
    }

    protected function getPackageProviders($app)
    {
        return [
            CookieSolutionServiceProvider::class,
        ];
    }

    public function getEnvironmentSetUp($app)
    {
        config()->set('database.default', 'testing');

        /*
        $migration = include __DIR__.'/../database/migrations/create_laravel-cookie-solution_table.php.stub';
        $migration->up();
        */
    }
}
