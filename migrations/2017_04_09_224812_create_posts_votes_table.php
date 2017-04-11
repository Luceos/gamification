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


use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('posts_votes', function (Blueprint $table) {
            $table->increments('post_id');
            $table->integer('user_id');
            $table->string('type');
        });
    },
    'down' => function (Builder $schema) {
        $schema->drop('posts_votes');
    },
];
