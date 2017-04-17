import { extend } from 'flarum/extend';
import app from 'flarum/app';
import Post from 'flarum/models/Post';
import User from 'flarum/models/User';
import Model from 'flarum/Model';
import NotificationGrid from 'flarum/components/NotificationGrid';

import AddVoteButtons from 'Reflar/gamification/components/AddVoteButtons';
import RankingsPage from 'Reflar/gamification/components/RankingsPage';


app.initializers.add('relar-gamification', () => {

  User.prototype.points = Model.attribute('points');

  Post.prototype.points = Model.attribute('points');
  Post.prototype.upvotes = Model.hasMany('upvotes');
  Post.prototype.downvotes = Model.hasMany('downvotes');

  app.routes.page = {path: '/rankings', component: RankingsPage.component()};

  AddVoteButtons();

  extend(NotificationGrid.prototype, 'notificationTypes', function (items) {
    items.add('userPromoted', {
      name: 'userPromoted',
      icon: 'arrow-up',
      label: app.translator.trans('reflar-gamification.notification.label')
    });
  });
});
