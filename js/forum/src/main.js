import { extend } from 'flarum/extend';
import app from 'flarum/app';
import Post from 'flarum/models/Post';
import User from 'flarum/models/User';
import Model from 'flarum/Model';
import NotificationGrid from 'flarum/components/NotificationGrid';

import addVoteButtons from 'Reflar/gamification/components/addVoteButtons';

app.initializers.add('relar-gamification', () => {

  User.prototype.Points = Model.attribute('Points');

  Post.prototype.Points = Model.attribute('Points');
  Post.prototype.Upvotes = Model.attribute('Upvotes');
  Post.prototype.Downvotes = Model.attribute('Downvotes');

  addVoteButtons();

  extend(NotificationGrid.prototype, 'notificationTypes', function (items) {
    items.add('userPromoted', {
      name: 'userPromoted',
      icon: 'arrow-up',
      label: app.translator.trans('reflar-gamification.notification.label')
    });
  });
});
