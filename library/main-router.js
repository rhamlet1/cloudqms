Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading',
  yieldTemplates: {
    myNav: { to: 'nav' },
    myFooter: { to: 'footer' },
  },
});

Router.route('/', {
  name: 'structures',
  template: 'structures',
});
