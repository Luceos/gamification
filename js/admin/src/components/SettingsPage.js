import Component from "flarum/Component";
import Button from "flarum/components/Button";
import saveSettings from "flarum/utils/saveSettings";
import Alert from "flarum/components/Alert";

export default class SettingsPage extends Component {

  init() {
    this.loading = false;

    this.fields = [
      'convertedLikes',
      'defaultRank',
      'amountPerPost',
      'amountPerDiscussion',
      'postStartAmount'
    ];


    // fields that are objects
    this.objects = [
      'ranks'
    ];


    this.values = {};

    this.settingsPrefix = 'reflar.gamification';

    const settings = app.data.settings;

    this.fields.forEach(key =>
      this.values[key] = m.prop(settings[this.addPrefix(key)])
    );

    this.objects.forEach(key =>
      this.values[key] = settings[this.addPrefix(key)] ? m.prop(JSON.parse(settings[this.addPrefix(key)])) : m.prop('')
    );

    this.values.ranks() || (this.values.ranks = m.prop({
      '50': 'Helper'
    }));

    this.newRank = {
      'points': m.prop(''),
      'name': m.prop('')
    };
  }

  /**
   * @returns {*}
   */
  view() {
    return [
      m('div', {className: 'SettingsPage'}, [
        m('div', {className: 'container'}, [
          m('form', {onsubmit: this.onsubmit.bind(this)}, [
            m('fieldset', {className: 'SettingsPage-ranks'}, [
              m('legend', {}, app.translator.trans('reflar-gamification.admin.page.ranks.title')),
              m('label', {}, app.translator.trans('reflar-gamification.admin.page.ranks.ranks')),
              m('div', {className: 'Ranks--Container'},
                Object.keys(this.values.ranks()).map(rank => {
                  return m('div', {}, [
                    m('input', {
                      className: 'FormControl Ranks-number',
                      type: 'number',
                      value: rank,
                      oninput: m.withAttr('value', this.updateRankPoints.bind(this, rank))
                    }),
                    m('input', {
                      className: 'FormControl Ranks-name',
                      value: this.values.ranks()[rank],
                      oninput: m.withAttr('value', this.updateRankName.bind(this, rank))
                    }),
                    Button.component({
                      type: 'button',
                      className: 'Button Button--warning',
                      children: 'x',
                      onclick: this.deleteRank.bind(this, rank)
                    }),
                  ])
                }),
                m('br'),
                m('div', {}, [
                  m('input', {
                    className: 'FormControl Ranks--number',
                    value: this.newRank.points(),
                    type: 'number',
                    oninput: m.withAttr('value', this.newRank.points)
                  }),
                  m('input', {
                    className: 'FormControl Ranks--name',
                    value: this.newRank.name(),
                    oninput: m.withAttr('value', this.newRank.name)
                  }),
                  Button.component({
                    type: 'button',
                    className: 'Button Button--warning',
                    children: '+',
                    onclick: this.addRank.bind(this)
                  }),
                ])
              ),
              m('div', {className: 'helpText'}, app.translator.trans('reflar-gamification.admin.page.ranks.help')),
              m('label', {}, app.translator.trans('reflar-gamification.admin.page.ranks.default')),
              m('input', {
                className: 'FormControl',
                value: this.values.defaultRank() || 'noob',
                oninput: m.withAttr('value', this.values.defaultRank)
              }),
            ]),
            Button.component({
              type: 'submit',
              className: 'Button Button--primary',
              children: app.translator.trans('flagrow-upload.admin.buttons.save'),
              loading: this.loading,
              disabled: !this.changed()
            }),
          ])
        ])
      ])
    ];
  }

  sendConverRequest() {
    app.request({
      url: app.forum.attribute('apiUrl') + '/reflar/gamification/convert',
      method: 'POST',
      data: {"do": "it"}
    }).then(this.values.convertedLikes = 1);
  }

  updateRankPoints(rank, value) {
    this.values.ranks()[value] = this.values.ranks()[rank];

    this.deleteRank(rank);
  }

  updateRankName(rank, value) {
    this.values.ranks()[rank] = value;
  }

  deleteRank(rank) {
    delete this.values.ranks()[rank];
  }

  addRank() {
    this.values.ranks()[this.newRank.points()] = this.newRank.name();

    this.newRank.points('');
    this.newRank.name('');
  }


  /**
   *
   * @returns boolean
   */
  changed() {
    var fieldsCheck = this.fields.some(key => this.values[key]() !== app.data.settings[this.addPrefix(key)]);
    var objectsCheck = this.objects.some(key => JSON.stringify(this.values[key]()) !== (app.data.settings[this.addPrefix(key)]));
    return fieldsCheck || objectsCheck;
  }

  /**
   * @param e
   */
  onsubmit(e) {
    e.preventDefault();

    if (this.loading) return;

    this.loading = true;

    app.alerts.dismiss(this.successAlert);

    const settings = {};

    this.fields.forEach(key => settings[this.addPrefix(key)] = this.values[key]());
    this.objects.forEach(key => settings[this.addPrefix(key)] = JSON.stringify(this.values[key]()));

    saveSettings(settings)
      .then(() => {
        app.alerts.show(this.successAlert = new Alert({
          type: 'success',
          children: app.translator.trans('core.admin.basics.saved_message')
        }));
      })
      .catch(() => {
      })
      .then(() => {
        this.loading = false;
        m.redraw();
      });
  }

  /**
   * @returns string
   */
  addPrefix(key) {
    return this.settingsPrefix + '.' + key;
  }
}