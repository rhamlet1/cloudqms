Router.route('/manageRoles', {
  name: 'manageRoles',
  template: 'manageRoles',
  waitOn: () => {
    return Meteor.subscribe('userList');
  },
});

Router.route('/viewActivityLog', {
  name: 'viewActivityLog',
  template: 'viewActivityLog',
  waitOn: () => {
    return Meteor.subscribe('activityLog');
  },
});
