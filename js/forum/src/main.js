import {extend} from 'flarum/extend';
import app from 'flarum/app';
import NotificationGrid from 'flarum/components/NotificationGrid';

import AddAttributes from 'Reflar/gamification/components/AddAttributes';
import AddHotnessFilter from 'Reflar/gamification/components/AddHotnessSort';
import AddVoteButtons from 'Reflar/gamification/components/AddVoteButtons';
import UserPromotedNotification from 'Reflar/gamification/components/UserPromotedNotification';
// import RankingsPage from 'Reflar/gamification/components/RankingsPage';


app.initializers.add('reflar-gamification', () => {

    app.notificationComponents.userPromoted = UserPromotedNotification;

    // app.routes.page = {path: '/rankings', component: RankingsPage.component()};

    AddVoteButtons();
    AddHotnessFilter();
    AddAttributes();

    extend(NotificationGrid.prototype, 'notificationTypes', function (items) {
        items.add('userPromoted', {
            name: 'userPromoted',
            icon: 'arrow-up',
            label: app.translator.trans('reflar-gamification.forum.notification.notify_user_promoted_label')
        });
    });
});
