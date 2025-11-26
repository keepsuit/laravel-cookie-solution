<?php

namespace Keepsuit\CookieSolution\Contracts;

use Illuminate\Support\HtmlString;

interface MarkdownParser
{
    public function parse(string $content): HtmlString;
}
