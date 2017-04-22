/*
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
import Notification from 'flarum/components/Notification';

export default class UserPromotedNotification extends Notification {
    icon() {
        return 'arrow-up';
    }

    href() {
        return app.route.post(this.props.notification.subject());
    }

    content() {
        const content = this.props.notification.notification.content() || {};

        return app.translator.trans('reflar-gamification.forum.notification.promoted', {content})
    }
}
