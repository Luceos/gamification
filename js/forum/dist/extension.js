'use strict';

System.register('Reflar/gamification/components/AddVoteButtons', ['flarum/extend', 'flarum/app', 'flarum/components/Button', 'flarum/components/CommentPost'], function (_export, _context) {
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

      items.add('upvote', Button.component({
        icon: 'thumbs-up',
        className: 'Post-vote Post-upvote',
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

          if (isUpvoted) {
            upData.unshift({ type: 'users', id: app.session.user.id() });
          }
        }
      }));

      items.add('points', m(
        'div',
        { className: 'Post-points' },
        post.data.relationships.upvotes.data.length - post.data.relationships.downvotes.data.length
      ));

      items.add('downvote', Button.component({
        icon: 'thumbs-down',
        className: 'Post-vote Post-downvote',
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

System.register('Reflar/gamification/components/RankingsPage', ['flarum/helpers/avatar', 'flarum/Component', 'flarum/components/IndexPage', 'flarum/helpers/listItems', 'flarum/helpers/icon', 'flarum/helpers/username', 'flarum/components/UserCard'], function (_export, _context) {
  "use strict";

  var avatar, Component, IndexPage, listItems, icon, username, UserCard, RankingsPage;
  return {
    setters: [function (_flarumHelpersAvatar) {
      avatar = _flarumHelpersAvatar.default;
    }, function (_flarumComponent) {
      Component = _flarumComponent.default;
    }, function (_flarumComponentsIndexPage) {
      IndexPage = _flarumComponentsIndexPage.default;
    }, function (_flarumHelpersListItems) {
      listItems = _flarumHelpersListItems.default;
    }, function (_flarumHelpersIcon) {
      icon = _flarumHelpersIcon.default;
    }, function (_flarumHelpersUsername) {
      username = _flarumHelpersUsername.default;
    }, function (_flarumComponentsUserCard) {
      UserCard = _flarumComponentsUserCard.default;
    }],
    execute: function () {
      RankingsPage = function (_Component) {
        babelHelpers.inherits(RankingsPage, _Component);

        function RankingsPage() {
          babelHelpers.classCallCheck(this, RankingsPage);
          return babelHelpers.possibleConstructorReturn(this, (RankingsPage.__proto__ || Object.getPrototypeOf(RankingsPage)).apply(this, arguments));
        }

        babelHelpers.createClass(RankingsPage, [{
          key: 'init',
          value: function init() {
            var _this2 = this;

            app.current = this;
            this.cardVisible = false;

            app.request({
              method: 'GET',
              url: app.forum.attribute('apiUrl') + '/rankings'
            }).then(function (response) {
              _this2.data = response.data;
              _this2.users = [];
              for (i = 0; i < _this2.data.length; i++) {
                _this2.users[i] = [];
                _this2.users[i]['user'] = _this2.findRecipient(_this2.data[i].id);
                _this2.users[i]['class'] = i + 1;
              }
              console.log(_this2.users);
              console.log(_this2.users[1]);
              _this2.loading = false;
              m.redraw();
            });
          }
        }, {
          key: 'view',
          value: function view() {
            return m(
              'div',
              { className: 'RankingPage' },
              IndexPage.prototype.hero(),
              m(
                'div',
                { className: 'container' },
                m(
                  'nav',
                  { className: 'IndexPage-nav sideNav', config: IndexPage.prototype.affixSidebar },
                  m(
                    'ul',
                    null,
                    listItems(IndexPage.prototype.sidebarItems().toArray())
                  )
                ),
                m(
                  'div',
                  { className: 'sideNavOffset' },
                  m(
                    'table',
                    { 'class': 'rankings' },
                    m(
                      'tr',
                      null,
                      m(
                        'th',
                        null,
                        app.translator.trans('reflar-gamification.forum.ranking.rank')
                      ),
                      m(
                        'th',
                        null,
                        app.translator.trans('reflar-gamification.forum.ranking.name')
                      ),
                      m(
                        'th',
                        null,
                        app.translator.trans('reflar-gamification.forum.ranking.amount')
                      )
                    ),
                    this.users.map(function (user) {

                      user['user'].then(function (user) {

                        var card = '';

                        return [m(
                          'tr',
                          null,
                          m(
                            'td',
                            { 'class': "rankings-" + user['class'] },
                            icon("trophy")
                          ),
                          m(
                            'td',
                            null,
                            m(
                              'div',
                              { className: 'PostUser' },
                              m(
                                'h3',
                                { className: 'rankings-info' },
                                m(
                                  'a',
                                  { href: app.route.user(user), config: m.route },
                                  avatar(user, { className: 'info-avatar rankings-' + user + '-avatar' })
                                )
                              ),
                              card
                            )
                          ),
                          m(
                            'td',
                            null,
                            user.data.attributes['antoinefr-money.money']
                          )
                        )];
                      });
                    })
                  )
                )
              )
            );
          }
        }, {
          key: 'findRecipient',
          value: function findRecipient(id) {
            return app.store.find('users', id);
          }
        }, {
          key: 'config',
          value: function config(isInitialized) {
            var _this3 = this;

            if (isInitialized) return;

            var timeout = void 0;

            this.$().on('mouseover', 'h3 a, .UserCard', function () {
              clearTimeout(timeout);
              timeout = setTimeout(_this3.showCard.bind(_this3), 500);
            }).on('mouseout', 'h3 a, .UserCard', function () {
              clearTimeout(timeout);
              timeout = setTimeout(_this3.hideCard.bind(_this3), 250);
            });
          }
        }, {
          key: 'showCard',
          value: function showCard() {
            var _this4 = this;

            this.cardVisible = true;

            m.redraw();

            setTimeout(function () {
              return _this4.$('.UserCard').addClass('in');
            });
          }
        }, {
          key: 'hideCard',
          value: function hideCard() {
            var _this5 = this;

            this.$('.UserCard').removeClass('in').one('transitionend webkitTransitionEnd oTransitionEnd', function () {
              _this5.cardVisible = false;
              m.redraw();
            });
          }
        }]);
        return RankingsPage;
      }(Component);

      _export('default', RankingsPage);
    }
  };
});;
'use strict';

System.register('Reflar/gamification/components/UserPromotedNotification', ['flarum/components/Notification'], function (_export, _context) {
    "use strict";

    var Notification, UserPromotedNotification;
    return {
        setters: [function (_flarumComponentsNotification) {
            Notification = _flarumComponentsNotification.default;
        }],
        execute: function () {
            UserPromotedNotification = function (_Notification) {
                babelHelpers.inherits(UserPromotedNotification, _Notification);

                function UserPromotedNotification() {
                    babelHelpers.classCallCheck(this, UserPromotedNotification);
                    return babelHelpers.possibleConstructorReturn(this, (UserPromotedNotification.__proto__ || Object.getPrototypeOf(UserPromotedNotification)).apply(this, arguments));
                }

                babelHelpers.createClass(UserPromotedNotification, [{
                    key: 'icon',
                    value: function icon() {
                        return 'arrow-up';
                    }
                }, {
                    key: 'href',
                    value: function href() {
                        return app.route.post(this.props.notification.subject());
                    }
                }, {
                    key: 'content',
                    value: function content() {
                        var content = this.props.notification.notification.content() || {};

                        return app.translator.trans('reflar-gamification.forum.notification.promoted', { content: content });
                    }
                }]);
                return UserPromotedNotification;
            }(Notification);

            _export('default', UserPromotedNotification);
        }
    };
});;
'use strict';

System.register('Reflar/gamification/main', ['flarum/extend', 'flarum/app', 'flarum/models/Post', 'flarum/models/User', 'flarum/Model', 'flarum/components/NotificationGrid', 'flarum/components/UserCard', 'Reflar/gamification/components/AddVoteButtons', 'Reflar/gamification/components/UserPromotedNotification'], function (_export, _context) {
  "use strict";

  var extend, app, Post, User, Model, NotificationGrid, UserCard, AddVoteButtons, UserPromotedNotification;
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
    }, function (_flarumComponentsUserCard) {
      UserCard = _flarumComponentsUserCard.default;
    }, function (_ReflarGamificationComponentsAddVoteButtons) {
      AddVoteButtons = _ReflarGamificationComponentsAddVoteButtons.default;
    }, function (_ReflarGamificationComponentsUserPromotedNotification) {
      UserPromotedNotification = _ReflarGamificationComponentsUserPromotedNotification.default;
    }],
    execute: function () {
      // import RankingsPage from 'Reflar/gamification/components/RankingsPage';


      app.initializers.add('reflar-gamification', function () {

        app.notificationComponents.userPromoted = UserPromotedNotification;

        User.prototype.points = Model.attribute('points');

        Post.prototype.upvotes = Model.hasMany('upvotes');
        Post.prototype.downvotes = Model.hasMany('downvotes');

        extend(UserCard.prototype, 'infoItems', function (items, user) {
          items.add('points', app.translator.trans('reflar-gamification.forum.user.points', { points: this.props.user.data.attributes.Points }));

          items.add('rank', app.translator.trans('reflar-gamification.forum.user.rank', { rank: this.props.user.data.attributes.Points || app.forum.attribute('DefaultRank') }));
        });

        // app.routes.page = {path: '/rankings', component: RankingsPage.component()};

        AddVoteButtons();

        extend(NotificationGrid.prototype, 'notificationTypes', function (items) {
          items.add('userPromoted', {
            name: 'userPromoted',
            icon: 'arrow-up',
            label: app.translator.trans('reflar-gamification.forum.notification.notify_user_promoted_label')
          });
        });
      });
    }
  };
});