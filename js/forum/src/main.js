import { extend } from 'flarum/extend';
import app from 'flarum/app';
import DiscussionList from 'flarum/components/DiscussionList';
import Post from 'flarum/models/Post';
import ItemList from 'flarum/utils/ItemList';
import User from 'flarum/models/User';
import Model from 'flarum/Model';
import IndexPage from 'flarum/components/IndexPage';
import NotificationGrid from 'flarum/components/NotificationGrid';
import UserCard from 'flarum/components/UserCard';
import Select from 'flarum/components/Select';

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
  
   IndexPage.prototype.viewItems = function() {
    const items = new ItemList();
    const sortMap = app.cache.discussionList.sortMap();

    const sortOptions = {};
    for (const i in sortMap) {
      sortOptions[i] = app.translator.trans('core.forum.index_sort.' + i + '_button');
    }
     
    items.add('sort',
      Select.component({
        options: sortOptions,
        value: sort || Object.keys(sortMap)[0],
        onchange: this.changeSort.bind(this)
      })
    );

    return items;
  }
  
  IndexPage.prototype.changeSort = function(sort) {
    const params = this.params();

    if (sort === 'hot') {
        m.route('/hot');
    } else { 
        if (sort === Object.keys(app.cache.discussionList.sortMap())[0]) {
          delete params.sort;
        } else {
          params.sort = sort;
        }
      m.route(app.route(this.props.routeName, params));
    }
  }
  
  extend(DiscussionList.prototype, 'sortMap', function(map) {
    map.hot = 'hot';
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
