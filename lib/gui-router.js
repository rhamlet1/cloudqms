Router.route('/gui', {
  name: 'gui',
  template: 'gui',
  waitOn: () => {
    return [
      Meteor.subscribe('TreeData')
    ];
  },
});
