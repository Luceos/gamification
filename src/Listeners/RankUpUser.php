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
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\gamification\Events\PostWasUpvoted;
use Reflar\gamification\Notification\RankupBlueprint;

class RankUpUser
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
     * @param SettingsRepositoryInterface $settings
     * @param NotificationSyncer $notifications
     */
    function __construct(SettingsRepositoryInterface $settings, NotificationSyncer $notifications)
    {
        $this->settings = $settings;
        $this->notifications = $notifications;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PostWasUpvoted::class, [$this, 'checkUser']);
    }

    /**
     * @param PostWasUpvoted $event
     */
    public function CheckUser(PostWasUpvoted $event)
    {
        $user = $event->user;
        $ranks = json_decode($this->settings->get('Reflar-Ranks'), true);

        if (isset($ranks[$user->votes])) {
            $user->rank = $ranks[$user->votes];
            $user->save();

            $this->notifications->sync(
                new PostLikedBlueprint($ranks[$user->votes]),
                $user);
        }
    }
}