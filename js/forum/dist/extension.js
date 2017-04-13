'use strict';

System.register('Reflar/gamification/components/addVoteButtons', ['flarum/extend', 'flarum/app', 'flarum/components/Button', 'flarum/components/CommentPost'], function (_export, _context) {
  "use strict";

  var extend, app, Button, CommentPost;

  _export('default', function () {
    extend(CommentPost.prototype, 'actionItems', function (items) {
      var post = this.props.post;

      if (post.isHidden()) return;

      var isUpvoted = app.session.user && post.upvotes().some(function (user) {
        return user === app.session.user;
      });
      var isDownvoted = app.session.user && post.downvotes().some(function (user) {
        return user === app.session.user;
      });

      console.log(isUpvoted);

      items.add('upvote', Button.component({
        icon: 'thumbs-up',
        className: '',
        style: isUpvoted !== false ? 'color:' + app.forum.attribute('themePrimaryColor') : 'color:',
        onclick: function onclick() {
          var upData = post.data.relationships.upvotes.data;
          var downData = post.data.relationships.downvotes.data;

          isUpvoted = !isUpvoted;

          isDownvoted = false;

          post.save({ isUpvoted: isUpvoted, isDownvoted: isDownvoted });

          upData.some(function (upvote, i) {
            if (upvote.id === app.session.user.id()) {
              upData.splice(i, 1);
              return true;
            }
          });

          downData.some(function (downvote, i) {
            if (downvote.id === app.session.user.id()) {
              downData.splice(i, 1);
              return true;
            }
          });
          console.log(isUpvoted);

          if (isUpvoted) {
            upData.unshift({ type: 'users', id: app.session.user.id() });
          }
        }
      }));

      items.add('downvote', Button.component({
        icon: 'thumbs-down',
        className: '',
        style: isDownvoted !== false ? 'color:' + app.forum.attribute('themePrimaryColor') : '',
        onclick: function onclick() {
          var upData = post.data.relationships.upvotes.data;
          var downData = post.data.relationships.downvotes.data;

          isDownvoted = !isDownvoted;

          isUpvoted = false;

          post.save({ isUpvoted: isUpvoted, isDownvoted: isDownvoted });

          upData.some(function (upvote, i) {
            if (upvote.id === app.session.user.id()) {
              upData.splice(i, 1);
              return true;
            }
          });

          downData.some(function (downvote, i) {
            if (downvote.id === app.session.user.id()) {
              downData.splice(i, 1);
              return true;
            }
          });

          if (isDownvoted) {
            downData.unshift({ type: 'users', id: app.session.user.id() });
          }
        }
      }));
    });
  });

  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumComponentsCommentPost) {
      CommentPost = _flarumComponentsCommentPost.default;
    }],
    execute: function () {}
  };
});;
'use strict';

System.register('Reflar/gamification/main', ['flarum/extend', 'flarum/app', 'flarum/models/Post', 'flarum/models/User', 'flarum/Model', 'flarum/components/NotificationGrid', 'Reflar/gamification/components/addVoteButtons'], function (_export, _context) {
  "use strict";

  var extend, app, Post, User, Model, NotificationGrid, addVoteButtons;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumModelsPost) {
      Post = _flarumModelsPost.default;
    }, function (_flarumModelsUser) {
      User = _flarumModelsUser.default;
    }, function (_flarumModel) {
      Model = _flarumModel.default;
    }, function (_flarumComponentsNotificationGrid) {
      NotificationGrid = _flarumComponentsNotificationGrid.default;
    }, function (_ReflarGamificationComponentsAddVoteButtons) {
      addVoteButtons = _ReflarGamificationComponentsAddVoteButtons.default;
    }],
    execute: function () {

      app.initializers.add('relar-gamification', function () {

        User.prototype.points = Model.attribute('points');

        Post.prototype.points = Model.attribute('points');
        Post.prototype.upvotes = Model.hasMany('upvotes');
        Post.prototype.downvotes = Model.hasMany('downvotes');

        addVoteButtons();

        extend(NotificationGrid.prototype, 'notificationTypes', function (items) {
          items.add('userPromoted', {
            name: 'userPromoted',
            icon: 'arrow-up',
            label: app.translator.trans('reflar-gamification.notification.label')
          });
        });
      });
    }
  };
});