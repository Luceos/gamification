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

use Flarum\Api\Controller;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Api\Serializer\UserBasicSerializer;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Core\Post;
use Flarum\Core\User;
use Flarum\Event\ConfigureApiController;
use Flarum\Event\GetApiRelationship;
use Flarum\Event\GetModelRelationship;
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
        $events->listen(GetModelRelationship::class, [$this, 'getModelRelationship']);
        $events->listen(GetApiRelationship::class, [$this, 'getApiAttributes']);
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
        $events->listen(ConfigureApiController::class, [$this, 'includeLikes']);
    }
    /**
     * @param GetModelRelationship $event
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany|null
     */
    public function getModelRelationship(GetModelRelationship $event)
    {
        if ($event->isRelationship(Post::class, 'upvotes')) {
            return $event->model->belongsToMany(User::class, 'posts_votes', 'post_id', 'user_id', 'upvotes')->where('type', 'Up');
        }

        if ($event->isRelationship(Post::class, 'downvotes')) {
            return $event->model->belongsToMany(User::class, 'posts_votes', 'post_id', 'user_id', 'downvotes')->where('type', 'Down');
        }
    }

    /**
     * @param GetApiRelationship $event
     * @return \Tobscure\JsonApi\Relationship|null
     */
    public function getApiAttributes(GetApiRelationship $event)
    {
        if ($event->isRelationship(PostSerializer::class, 'upvotes')) {
            return $event->serializer->hasMany($event->model, UserBasicSerializer::class, 'upvotes');
        }

        if ($event->isRelationship(PostSerializer::class, 'downvotes')) {
            return $event->serializer->hasMany($event->model, UserBasicSerializer::class, 'downvotes');
        }
    }

    /**
     * @param PrepareApiAttributes $event
     */
    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(PostSerializer::class)) {
            $event->attributes['Points'] = $this->gamification->getPostVotes($event->model);
        }

        if ($event->isSerializer(UserSerializer::class)) {
            $event->attributes['Points'] = $this->gamification->getUserVotes($event->model->id);
        }
    }

    /**
     * @param ConfigureApiController $event
     */
    public function includeLikes(ConfigureApiController $event)
    {
        if ($event->isController(Controller\ShowDiscussionController::class)) {
            $event->addInclude('posts.upvotes');
            $event->addInclude('posts.downvotes');
        }
        if ($event->isController(Controller\ListPostsController::class)
            || $event->isController(Controller\ShowPostController::class)
            || $event->isController(Controller\CreatePostController::class)
            || $event->isController(Controller\UpdatePostController::class)) {
            $event->addInclude('upvotes');
            $event->addInclude('downvotes');
        }
    }
}