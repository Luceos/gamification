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

use Flarum\Core\Notification\NotificationSyncer;
use Flarum\Event\PostWasPosted;
use Flarum\Event\PostWasDeleted;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\gamification\Events\PostWasUpvoted;
use Reflar\gamification\Notification\RankupBlueprint;
use Reflar\gamification\Repository\Gamification;

class EventHandlers
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var NotificationSyncer
     */
    protected $notifications;

    /**
     * @var Gamification
     */
    protected $gamification;

    /**
     * @param SettingsRepositoryInterface $settings
     * @param NotificationSyncer $notifications
     */
    function __construct(SettingsRepositoryInterface $settings, NotificationSyncer $notifications, Gamification $gamification)
    {
        $this->settings = $settings;
        $this->notifications = $notifications;
        $this->gamification = $gamification;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PostWasUpvoted::class, [$this, 'checkUser']);
        $events->listen(PostWasPosted::class, [$this, 'addVote']);
        $events->listen(PostWasDeleted::class, [$this, 'removeVote']);
    }

    /**
     * @param PostWasUpvoted $event
     */
    public function CheckUser(PostWasUpvoted $event)
    {
        $user = $event->user;

        $ranks = json_decode($this->settings->get('reflar.gamification.ranks'), true);

        if (isset($ranks[$user->votes])) {
            $user->rank = $ranks[$user->votes];
            $user->save();

            $this->notifications->sync(
                new RankupBlueprint($ranks[$user->votes], $event->actor),
                [$user]);
        }
    }

    public function addVote(PostWasPosted $event)
    {
        $event->actor->increment('votes');
        $this->gamification->upvote($event->post->id, $event->actor);
    }

    public function removeVote(PostWasDeleted $event)
    {
        $event->post->user->decrement('votes');
    }
}