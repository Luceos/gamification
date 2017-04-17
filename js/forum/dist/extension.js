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
              console.log(response.data);
              _this2.data = response.data;
              _this2.users = [];
              for (i = 0; i < _this2.data.length; i++) {
                _this2.users[i] = [];
                _this2.users[i]['user'] = _this2.findRecipient(_this2.data[i].id);
                _this2.users[i]['class'] = i + 1;
              }
              console.log(_this2.users);
              _this2.loading = false;
              m.redraw();
            });
          }
        }, {
          key: 'view',
          value: function view() {
            var _this3 = this;

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

                      console.log(user[0]);
                      console.log(user['0']);
                      console.log(user);
                      console.log(user['User']);
                      console.log(user.user);
                      var card = '';

                      if (_this3.cardVisible) {
                        card = UserCard.component({
                          user: user[0],
                          className: 'UserCard--popover',
                          controlsButtonClassName: 'Button Button--icon Button--flat'
                        });
                      }
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
                                { href: app.route.user(user[0]), config: m.route },
                                avatar(user[0], { className: 'info-avatar rankings-' + user[0] + '-avatar' })
                              )
                            ),
                            card
                          )
                        ),
                        m(
                          'td',
                          null,
                          user[0].data.attributes['antoinefr-money.money']
                        )
                      )];
                    })
                  )
                )
              )
            );
          }
        }, {
          key: 'findRecipient',
          value: function findRecipient(id) {
            var promise = '';
            app.store.find('users', id).then(function (user) {
              return promise = user;
            });
            return promise;
          }
        }, {
          key: 'config',
          value: function config(isInitialized) {
            var _this4 = this;

            if (isInitialized) return;

            var timeout = void 0;

            this.$().on('mouseover', 'h3 a, .UserCard', function () {
              clearTimeout(timeout);
              timeout = setTimeout(_this4.showCard.bind(_this4), 500);
            }).on('mouseout', 'h3 a, .UserCard', function () {
              clearTimeout(timeout);
              timeout = setTimeout(_this4.hideCard.bind(_this4), 250);
            });
          }
        }, {
          key: 'showCard',
          value: function showCard() {
            var _this5 = this;

            this.cardVisible = true;

            m.redraw();

            setTimeout(function () {
              return _this5.$('.UserCard').addClass('in');
            });
          }
        }, {
          key: 'hideCard',
          value: function hideCard() {
            var _this6 = this;

            this.$('.UserCard').removeClass('in').one('transitionend webkitTransitionEnd oTransitionEnd', function () {
              _this6.cardVisible = false;
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

System.register('Reflar/gamification/main', ['flarum/extend', 'flarum/app', 'flarum/models/Post', 'flarum/models/User', 'flarum/Model', 'flarum/components/NotificationGrid', 'Reflar/gamification/components/AddVoteButtons', 'Reflar/gamification/components/RankingsPage'], function (_export, _context) {
  "use strict";

  var extend, app, Post, User, Model, NotificationGrid, AddVoteButtons, RankingsPage;
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
      AddVoteButtons = _ReflarGamificationComponentsAddVoteButtons.default;
    }, function (_ReflarGamificationComponentsRankingsPage) {
      RankingsPage = _ReflarGamificationComponentsRankingsPage.default;
    }],
    execute: function () {

      app.initializers.add('relar-gamification', function () {

        User.prototype.points = Model.attribute('points');

        Post.prototype.points = Model.attribute('points');
        Post.prototype.upvotes = Model.hasMany('upvotes');
        Post.prototype.downvotes = Model.hasMany('downvotes');

        app.routes.page = { path: '/rankings', component: RankingsPage.component() };

        AddVoteButtons();

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