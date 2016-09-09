<?php

namespace Modularity\Module\MainNews;

class MainNews extends \Modularity\Module
{
    public function __construct()
    {
        $this->register(
            'mainnews',
            __('Main News', 'modularity'),
            __('Main News', 'modularity'),
            'Outputs a list of prioritized articles',
            array(),
            null,
            null,
            true,
            3600*24*7
        );
    }
}