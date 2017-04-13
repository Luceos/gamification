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

namespace Reflar\gamification\Repository;

use Flarum\Core\Post;
use Flarum\Core\Repository\PostRepository;
use Flarum\Core\Repository\UserRepository;
use Flarum\Core\User;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\gamification\Events\PostWasDownvoted;
use Reflar\gamification\Events\PostWasUpvoted;
use Reflar\gamification\Vote;

class Gamification
{
    /**
     * @var Dispatcher
     */
    protected $events;

    /**
     * @var PostRepository
     */
    protected $posts;

    /**
     * @var UserRepository
     */
    protected $users;

    /**
     * @param Dispatcher $events
     * @param PostRepository $posts
     * @param UserRepository $users
     */
    public function __construct(Dispatcher $events, PostRepository $posts, UserRepository $users)
    {
        $this->events = $events;
        $this->posts = $posts;
        $this->users = $users;
    }

    /**
     * @return mixed
     */
    public function query()
    {
        return posts_votes::query();
    }

    /**
     * @param $post_id
     * @param $user_id
     * @param $type
     */
    public function saveVote($post_id, $user_id, $type)
    {
        $vote = new Vote();
        $vote->post_id = $post_id;
        $vote->user_id = $user_id;
        $vote->type = $type;
        $vote->save();
    }

    /**
     * @param $post_id
     * @param User $actor
     */
    public function upvote($post_id, User $actor)
    {
        $post = $this->posts->findOrFail($post_id, $actor);
        $user = $post->user;

        $this->saveVote($post->id, $actor->id, 'Up');

        $this->events->fire(
            new PostWasUpvoted($post, $user, $actor)
        );
    }

    /**
     * @param $post_id
     * @param User $actor
     */
    public function downvote($post_id, User $actor)
    {
        $post = $this->posts->findOrFail($post_id, $actor);
        $user = $post->user;

        $this->saveVote($post->id, $actor->id, 'Down');

        $this->events->fire(
          new PostWasDownvoted($post, $user, $actor)
        );
    }

    /**
     * @param $post
     * @return mixed
     */
    public function getPostVotes($post)
    {
        $post = $this->posts->findOrFail($post->id, $post->user);

        return $post->votes;
    }

    /**
     * @param $user_id
     * @return mixed
     */
    public function getUserVotes($user_id)
    {
        $user = $this->users->findOrFail($user_id);

        return $user->votes;
    }

    /**
     * @param $post_id
     * @param $user_id
     * @return mixed
     */
    public function findVote($post_id, $user_id) {
        return Vote::where([
            'post_id' => $post_id,
            'user_id' => $user_id
            ])->first();
    }

}