<?php

namespace Keepsuit\CookieSolution\Support;

use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;
use Keepsuit\CookieSolution\Contracts\MarkdownParser;
use League\CommonMark\Extension\CommonMark\Node\Block\Heading;
use League\CommonMark\Extension\CommonMark\Node\Block\ListBlock;
use League\CommonMark\Extension\CommonMark\Node\Block\ListItem;
use League\CommonMark\Extension\DefaultAttributes\DefaultAttributesExtension;
use League\CommonMark\Node\Block\Paragraph;

class DefaultMarkdownParser implements MarkdownParser
{
    public function parse(string $content): HtmlString
    {
        $html = Str::markdown(
            $content,
            options: [
                'default_attributes' => [
                    Heading::class => [
                        'part' => fn (Heading $node) => sprintf('headings h%d', $node->getLevel()),
                    ],
                    Paragraph::class => [
                        'part' => 'p',
                    ],
                    ListBlock::class => [
                        'part' => fn (ListBlock $node) => $node->getListData()->type === ListBlock::TYPE_ORDERED ? 'ol' : 'ul',
                    ],
                    ListItem::class => [
                        'part' => 'li',
                    ],
                ],
            ],
            extensions: [
                new DefaultAttributesExtension,
            ]
        );

        return new HtmlString($html);
    }
}
