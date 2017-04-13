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

namespace Reflar\gamification\Api\Controllers;

use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Repository\PostRepository;
use Flarum\Http\Controller\ControllerInterface;
use Flarum\Settings\SettingsRepositoryInterface;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\gamification\Repository\Gamification;

class ConvertLikesController implements ControllerInterface
{

    use AssertPermissionTrait;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var Gamification
     */
    protected $gamification;

    /**
     * @var PostRepository
     */
    protected $posts;

    /**
     * @param SettingsRepositoryInterface $settings
     * @param ConvertLikes $convert
     * @param PostRepository $posts
     */
    public function __construct(SettingsRepositoryInterface $settings, Gamification $gamification, PostRepository $posts)
    {
        $this->settings = $settings;
        $this->gamification = $gamification;
        $this->posts = $posts;
    }

    /**
     * @param ServerRequestInterface $request
     * @return int
     */
    public function handle(ServerRequestInterface $request)
    {
        $actor = $request->getAttribute('actor');

        if ($actor !== null && $actor->isAdmin() && $request->getMethod() === 'POST' && $this->settings->get('reflar.gamification.convertedLikes') == false) {
                $likes = app('db')->table('posts_likes')->get();

                $counter = 0;

                foreach ($likes as $like) {
                    $post = $this->posts->findOrFail($like->post_id, $actor);

                    $this->gamification->saveVote($post->id, $like->user_id, 'Up');

                    $post->user->increment('votes');
                    $post->increment('votes');

                    $counter++;
                }
                return $counter;
        }
    }
}