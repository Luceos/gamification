import Component from 'flarum/Component';
import IndexPage from 'flarum/components/IndexPage';
import listItems from 'flarum/helpers/listItems';
import icon from 'flarum/helpers/icon';
import avatar from 'flarum/helpers/avatar';
import username from 'flarum/helpers/username';
import LinkButton from 'flarum/components/LinkButton.js';

export default class RankingaPage extends Component {
  init() {    
    app.current = this;
    app.history.push('ranking');
  }

  view() {
    return (
      <div className="RankingPage">
        {IndexPage.prototype.hero()}
        <div className="container">
          <nav className="IndexPage-nav sideNav" config={IndexPage.prototype.affixSidebar}>
            <ul>{listItems(IndexPage.prototype.sidebarItems().toArray())}</ul>
          </nav>

          <div className="sideNavOffset">
            <table class="ranking">
              <tr>
                <th>{app.translator.trans('antoinefr-money.forum.ranking.rank')}</th>
                <th>{app.translator.trans('antoinefr-money.forum.ranking.name')}</th>
                <th>{app.translator.trans('antoinefr-money.forum.ranking.amount')}</th>
              </tr>
              <tr>
                <td class="ranking-first">{icon("trophy")} {app.translator.trans('antoinefr-money.forum.ranking.order_first')}</td>
                <td>
                  {avatar(this.users[0])}
                  <a href={app.route.user(this.users[0])}>{this.users[0].username()}</a>
                </td>
                <td>{this.users[0].data.attributes['antoinefr-money.money']}</td>
              </tr>
              <tr>
                <td class="ranking-second">{icon("trophy")} {app.translator.trans('antoinefr-money.forum.ranking.order_second')}</td>
                <td>
                  {avatar(this.users[0])}
                  <a href={app.route.user(this.users[0])}>{this.users[0].username()}</a>
                </td>
                <td>{this.users[0].data.attributes['antoinefr-money.money']}</td>
              </tr>
              <tr>
                <td class="ranking-third">{icon("trophy")} {app.translator.trans('antoinefr-money.forum.ranking.order_third')}</td>
                <td>
                  {avatar(this.users[0])}
                  <a href={app.route.user(this.users[0])}>{this.users[0].username()}</a>
                </td>
                <td>{this.users[0].data.attributes['antoinefr-money.money']}</td>
              </tr>
              <tr>
                <td>{app.translator.trans('antoinefr-money.forum.ranking.order_other', {order: 4})}</td>
                <td>
                  {avatar(this.users[0])}
                  <a href={app.route.user(this.users[0])}>{this.users[0].username()}</a>
                </td>
                <td>{this.users[0].data.attributes['antoinefr-money.money']}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    );
  }
}