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

use Flarum\Event\PostWasDeleted;
use Flarum\Event\PostWillBeSaved;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\gamification\Repository\Gamification;

class SaveVotesToDatabase
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
        $events->listen(PostWillBeSaved::class, [$this, 'whenPostWillBeSaved']);
        $events->listen(PostWasDeleted::class, [$this, 'whenPostWasDeleted']);
    }

    /**
     * @param PostWillBeSaved $event
     */
    public function whenPostWillBeSaved(PostWillBeSaved $event)
    {
        $post = $event->post;
        $data = $event->data;
        $actor = $event->actor;

        if (isset($data['attributes']['isUpvoted'])) {
            $isUpvoted = $data['attributes']['isUpvoted'];
        } else {
            $isUpvoted = false;
        }

        if (isset($data['attributes']['isDownvoted'])) {
            $isDownvoted = $data['attributes']['isDownvoted'];
        } else {
            $isDownvoted = false;
        }

        if ($post->exists) {

            $vote = $this->gamification->findVote($post->id, $actor->id);

            if (isset($vote)) {

                if ($isUpvoted == false && $isDownvoted == false) {
                    if ($vote->type == 'Up')
                    {
                        $post->user->decrement('votes');
                        $post->decrement('votes');

                    } else {
                        $post->user->increment('votes');
                        $post->increment('votes');
                    }
                    $vote->delete();

                } elseif ($vote->type == 'Up') {
                        $vote->type = 'Down';

                        $vote->save();

                        $post->votes = $post->votes - 2;
                        $post->user->votes = $post->user->votes - 2;

                } elseif ($vote->type == 'Down') {
                        $vote->type = 'Up';

                        $vote->save();

                    $post->votes = $post->votes + 2;
                    $post->user->votes = $post->user->votes + 2;
                }

            } elseif ($isDownvoted == true) {
                $this->gamification->downvote($post->id, $actor);

                $post->user->decrement('votes');
                $post->decrement('votes');

            } elseif ($isUpvoted == true) {
                $this->gamification->upvote($post->id, $actor);

                $post->user->decrement('votes');
                $post->increment('votes');
            }
        }
    }

    /**
     * @param PostWasDeleted $event
     */
    public function whenPostWasDeleted(PostWasDeleted $event)
    {
        $this->gamification->deleteVotesForPost($event->post->id);
    }
}