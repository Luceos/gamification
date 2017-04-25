import Notification from 'flarum/components/Notification';

export default class UserPromotedNotification extends Notification {
    icon() {
        return 'arrow-up';
    }

    href() {
        return app.route.user(this.props.notification.subject());
    }

    content() {
        const content = this.props.notification.notification.content() || {};

        return app.translator.trans('reflar-gamification.forum.notification.promoted', {content})
    }
}
