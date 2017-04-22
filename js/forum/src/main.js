import { extend } from 'flarum/extend';
import app from 'flarum/app';
import Post from 'flarum/models/Post';
import User from 'flarum/models/User';
import Model from 'flarum/Model';
import NotificationGrid from 'flarum/components/NotificationGrid';
import UserCard from 'flarum/components/UserCard';

import AddVoteButtons from 'Reflar/gamification/components/AddVoteButtons';
import UserPromotedNotification from 'Reflar/gamification/components/UserPromotedNotification';
// import RankingsPage from 'Reflar/gamification/components/RankingsPage';


app.initializers.add('reflar-gamification', () => {

  app.notificationComponents.userPromoted = UserPromotedNotification;

  User.prototype.points = Model.attribute('points');

  Post.prototype.upvotes = Model.hasMany('upvotes');
  Post.prototype.downvotes = Model.hasMany('downvotes');
  
  extend(UserCard.prototype, 'infoItems', function(items, user) {
    items.add('points',
        app.translator.trans('reflar-gamification.forum.user.points', {points: this.props.user.data.attributes.Points})
     );

      items.add('rank',
          app.translator.trans('reflar-gamification.forum.user.rank', {rank: this.props.user.data.attributes.Points || app.forum.attribute('DefaultRank')})
      );
  });

  // app.routes.page = {path: '/rankings', component: RankingsPage.component()};

  AddVoteButtons();

  extend(NotificationGrid.prototype, 'notificationTypes', function(items) {
    items.add('userPromoted', {
      name: 'userPromoted',
      icon: 'arrow-up',
      label: app.translator.trans('reflar-gamification.forum.notification.notify_user_promoted_label')
    });
  });
});
