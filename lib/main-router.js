Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading',
  yieldTemplates: {
    myNav: { to: 'nav' },
    myFooter: { to: 'footer' },
    qmsTree: { to: 'tree' },
  },
});

Router.route('/', {
  name: 'structures',
  template: 'structures',
});

Router.route('/register', {
  name: 'register',
  template: 'register',
});

Router.route('/login', {
  name: 'login',
  template: 'login',
});
