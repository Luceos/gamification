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

namespace Reflar\gamification;

use Flarum\Core\Post;
use Flarum\Core\Repository\PostRepository;
use Flarum\Core\User;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\gamification\Vote;

class Gamification
{
    protected $events;

    protected $posts;

    protected $users;

    public function __construct(Dispatcher $events, PostRepository $posts, UserRepository $users)
    {
        $this->events = $events;
        $this->posts = $posts;
        $this->users = $users;
    }

    public function query()
    {
        return posts_votes::query();
    }

    private function saveVote($post_id, $user_id, $type)
    {
        $vote = new Vote();
        $vote->post_id = $post_id;
        $vote->user_id = $user_id;
        $vote->type = $type;
        $vote->save();
    }

    public function upvote($post_id, User $actor)
    {
        $post = $this->posts->findOrFail($post_id);

        $actor->votes = $actor->votes++;
        $actor->save();

        $this->saveVote($post->id, $actor->id, 'Up');
        $post->votes = $post->votes++;
        $post->save();

        $this->events->fire(
            new PostWasUpvoted($post, $actor)
        );
    }

    public function downvote($post_id, User $actor)
    {
        $post = $this->posts->findOrFail($post_id);

        $actor->votes = $actor->votes--;
        $actor->save();

        $this->saveVote($post->id, $actor->id, 'Down');
        $post->votes = $post->votes--;
        $post->save();

        $this->events->fire(
          new PostWasDownvoted($post, $actor)
        );
    }

    public function getPostVotes($post_id)
    {
        $post = $this->posts->findOrFail($post_id);

        return $post->votes;
    }

    public function getUserVotes($user_id)
    {
        $user = $this->users->findOrFail($user_id);

        return $user->votes;
    }

}