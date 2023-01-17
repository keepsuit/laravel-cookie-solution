<?php

namespace Keepsuit\CookieSolution;

enum CookiePurpose: string
{
    case NECESSARY = 'necessary';
    case PREFERENCES = 'preferences';
    case STATISTICS = 'statistics';
    case MARKETING = 'marketing';
}
