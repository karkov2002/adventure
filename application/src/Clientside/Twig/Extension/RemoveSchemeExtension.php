<?php

namespace App\Clientside\Twig\Extension;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class RemoveSchemeExtension extends AbstractExtension
{
    protected $container;

    public function getFilters()
    {
        return [
            new TwigFilter('remove_scheme', [$this, 'removeScheme']),
        ];
    }

    public function removeScheme($str): string
    {
        return str_replace(['https://', 'http://'], '', $str);
    }
}
