'use strict';

System.register('Reflar/gamification/components/addVoteButtons', ['flarum/extend', 'flarum/app', 'flarum/components/Button', 'flarum/components/CommentPost'], function (_export, _context) {
  "use strict";

  var extend, app, Button, CommentPost;

  _export('default', function () {
    extend(CommentPost.prototype, 'actionItems', function (items) {
      var post = this.props.post;

      if (post.isHidden()) return;

      this.isUpvoted = m.prop('');

      var upvotes = post.data.attributes.Upvotes;
      var downvotes = post.data.attributes.Downvotes;

      var isUpvoted = '';
      var isDownvoted = '';

      upvotes.forEach(function (upvote) {
        if (upvote.user_id == app.session.user.data.id) {
          isUpvoted = true;
        }
      });

      downvotes.forEach(function (downvote) {
        if (downvote.user_id == app.session.user.data.id) {
          var _isDownvoted = true;
        }
      });

      items.add('Upvote', Button.component({
        className: 'fa fa-arrow-up upvote',
        style: isUpvoted === true ? 'color:' + app.forum.attribute('themePrimaryColor') : '',
        onclick: function onclick() {
          isUpvoted = !isUpvoted;

          console.log('hio');

          if (isDownvoted == true) {
            isDownvoted = false;
          }

          m.redraw();
        }
      }));

      items.add('Downvote', Button.component({
        className: 'fa fa-arrow-down downvote',
        style: isDownvoted === true ? 'color:' + app.forum.attribute('themePrimaryColor') : '',
        onclick: function onclick() {
          isDownvoted = !isDownvoted;

          if (isUpvoted == true) {
            isUpvoted = false;
          }

          m.redraw();
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
    }
  };
});