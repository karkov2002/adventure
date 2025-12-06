<?php

namespace App\Clientside\Twig\Extension;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class JsonExtension extends AbstractExtension
{
    protected $container;

    public function getFilters()
    {
        return [
            new TwigFilter('json_decode', [$this, 'jsonDecode']),
        ];
    }

    public function jsonDecode($str): array
    {
        $result = json_decode($str, true);

        if (empty($result)) {
            return [];
        }

        return $result;
    }
}
