<?php

namespace Keepsuit\CookieSolution\Commands;

use Illuminate\Console\Command;

class CookieSolutionCommand extends Command
{
    public $signature = 'laravel-cookie-solution';

    public $description = 'My command';

    public function handle(): int
    {
        $this->comment('All done');

        return self::SUCCESS;
    }
}
