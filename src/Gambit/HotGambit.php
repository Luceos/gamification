<?php
/**
 *
 *  This file is part of reflar/gamification.
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 *
 */

namespace Reflar\gamification\Gambit;

use Flarum\Core\Search\AbstractRegexGambit;
use Flarum\Core\Search\AbstractSearch;
use Illuminate\Database\Query\Expression;

class HotGambit extends AbstractRegexGambit
{
    /**
     * @var string
     */
    protected $pattern = 'is:(hot|popular)';

    /**
     * @param AbstractSearch $search
     * @param array $matches
     * @param $negate
     */
    protected function conditions(AbstractSearch $search, array $matches, $negate)
    {
        $actor = $search->getActor();

        $search->getQuery()->sortBy(function ($query) use ($negate) {
            die(var_dump($query));
        });
    }
}