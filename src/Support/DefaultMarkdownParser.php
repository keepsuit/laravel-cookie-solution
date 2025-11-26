<?php

namespace Keepsuit\CookieSolution\Support;

use Illuminate\Support\HtmlString;
use Keepsuit\CookieSolution\Contracts\MarkdownParser;
use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\CommonMark\Node\Block\Heading;
use League\CommonMark\Extension\CommonMark\Node\Block\ListBlock;
use League\CommonMark\Extension\CommonMark\Node\Block\ListItem;
use League\CommonMark\Extension\DefaultAttributes\DefaultAttributesExtension;
use League\CommonMark\MarkdownConverter;
use League\CommonMark\Node\Block\Paragraph;

class DefaultMarkdownParser implements MarkdownParser
{
    public function parse(string $content): HtmlString
    {
        $environment = new Environment([
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
        ]);

        $environment->addExtension(new CommonMarkCoreExtension);
        $environment->addExtension(new DefaultAttributesExtension);

        return new HtmlString((string) (new MarkdownConverter($environment))->convert($content));
    }
}
