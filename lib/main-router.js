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
