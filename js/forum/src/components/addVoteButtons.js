import { extend } from 'flarum/extend';
import app from 'flarum/app';
import Button from 'flarum/components/Button';
import CommentPost from 'flarum/components/CommentPost';

export default function() {
  extend(CommentPost.prototype, 'actionItems', function(items) {
    const post = this.props.post;

    if (post.isHidden()) return;

    this.isUpvoted = m.prop('')

    const upvotes = post.data.attributes.Upvotes;
    const downvotes = post.data.attributes.Downvotes;

    let isUpvoted = '';
    let isDownvoted = '';

    upvotes.forEach(function(upvote) {
      if (upvote.user_id == app.session.user.data.id) {
        isUpvoted = true;
      }
    });

    downvotes.forEach(function(downvote) {
      if (downvote.user_id == app.session.user.data.id) {
        isDownvoted  = true;
      }
    });


    items.add('Upvote',
      Button.component({
        className: 'fa fa-arrow-up upvote',
        style: (isUpvoted === true ? 'color:' + app.forum.attribute('themePrimaryColor') : ''),
        onclick: () => {
          isUpvoted = !isUpvoted;


          if (isDownvoted == true) {
            isDownvoted = false;
          }


          m.redraw();

        }
      })
    );

    items.add('Downvote',
      Button.component({
        className: 'fa fa-arrow-down downvote',
        style: (isDownvoted === true ? 'color:' + app.forum.attribute('themePrimaryColor') : ''),
        onclick: () => {
          isDownvoted = !isDownvoted;

          if (isUpvoted == true) {
            isUpvoted = false;
          }


          m.redraw();

        }
      })
    );
  });
}
