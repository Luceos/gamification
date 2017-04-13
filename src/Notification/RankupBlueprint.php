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

namespace Reflar\gamification\Notification;

use Flarum\Core\Notification\BlueprintInterface;
use Flarum\Core\User;

class RankupBlueprint implements BlueprintInterface
{

    /**
     * @var string
     */
    public $rank;

    /**
     * @param $rank
     */
    public function __construct($rank, User $user)
    {
        $this->rank = $rank;
        $this->user = $user;
    }

    /**
     * {@inheritdoc}
     */
    public function getSubject()
    {
        return $this->rank;
    }

    /**
     * {@inheritdoc}
     */
    public function getSender()
    {
    }

    /**
     * {@inheritdoc}
     */
    public function getData()
    {
    }

    /**
     * {@inheritdoc}
     */
    public static function getType()
    {
        return 'userPromoted';
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubjectModel()
    {
    }
}