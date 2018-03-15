Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading',
  yieldTemplates: {
    myNav: { to: 'nav' },
    myFooter: { to: 'footer' },
    qmsTree: { to: 'tree' },
  },
});

Router.route('/register', {
  name: 'register',
  template: 'register',
});

Router.route('/login', {
  name: 'login',
  template: 'login',
});

Router.route('/', {
  name: 'home',
  template: 'home',
});
