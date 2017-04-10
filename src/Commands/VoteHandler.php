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

namespace Reflar\gamification\Commands;

use Reflar\gamification\Gamification;

class VoteHandler
{
    protected $gamification;

    public function __construct(Gamification $gamification)
    {
        $this->gamification = $gamification;
    }

    public function handle(Vote $command)
    {
        $postId = $command->post_id;
        $actor = $command->actor;

        if ($command->type == 'Up') {
            $this->gamification->upvote($postId, $actor);
        } else {
            $this->gamification->downvote($postId, $actor);
        }
    }
}