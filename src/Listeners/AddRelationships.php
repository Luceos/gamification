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

namespace Reflar\gamification\Listeners;

use Flarum\Api\Serializer\PostSerializer;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Event\PrepareApiAttributes;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\gamification\Repository\Gamification;


class AddRelationships
{
    /**
     * @var Gamification
     */
    protected $gamification;

    public function __construct(Gamification $gamification)
    {
        $this->gamification = $gamification;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
    }



    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(PostSerializer::class)) {
            $event->attributes['Points'] = $this->gamification->getPostVotes($event->model);
            $event->attributes['Upvotes'] = $this->gamification->getUpvotesForPost($event->model->id);
            $event->attributes['Downvotes'] = $this->gamification->getDownvotesForPost($event->model->id);
        }

        if ($event->isSerializer(UserSerializer::class)) {
            $event->attributes['Points'] = $this->gamification->getUserVotes($event->model->id);
        }
    }
}