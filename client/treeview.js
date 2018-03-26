ViewModel.share({
  options: {
    create: true,
    rename: true,
    delete: true,
    copy: false,
    move: true,
    dnd: true,
    contextmenu: true,
    state: true,
    checkbox: false,
    sort: true,
    parentNode: null,
    selectNode: null,
    openAll: false,
    selectAll: false,
    getNodes: false,
    configurationString: ""
  }
});

Template.TreeData.onCreated(function () {
  let instance = this;
  instance.message = new ReactiveVar('Messages will be put here.');
});

Template.TreeData.viewmodel({
  share: 'options',
  treeArgs() {

    let instance = Template.instance();

    let plugins = [];

    if (this.checkbox()) plugins.push('checkbox');
    if (this.contextmenu()) plugins.push('contextmenu');
    if (this.dnd()) plugins.push('dnd');
    if (this.sort()) plugins.push('sort');
    if (this.state()) plugins.push('state');

    config = {
      collection: TreeData,
      subscription: 'TreeData',
      parent: this.parentNode(),
      select: this.selectNode(),
      openAll: this.openAll(),
      selectAll: this.selectAll(),
      mapping: {
        text: 'name',
        aAttr: function (item) {
          return {
            title: item._id
          };
        }
      },
      jstree: { plugins },
      events: {
        changed(e, item, data) {
          // item is an array of type Meteor id strings
          // File Collection requires the array to be in the form of a Meteor ObjectID
          Session.set('selectedFile', item['0']);
          instance.message.set("Changing selection. " + item.length + " nodes are selected.");
        },
        create(e, item, data) {
          // TreeView item is a Meteor id of type String
          // File Collection requires the id (item) to be in the form of a Meteor ObjectID
          instance.message.set("Creating node on " + data.parent);
          const fileId = Meteor.call('insertFileParent', data.parent);
          item._id = fileId;
        },
        rename(e, item, data) {
          instance.message.set("Renaming " + item + " to " + data.text);
          const fileId = Meteor.call('renameFile', item, data.text);
        },
        delete(e, item, data) {
          instance.message.set("Deleting " + item);
          Meteor.call('deleteNode', item);
        },
        copy(e, item, data) {
          if (data.parent == '#') {
            instance.message.set("Copying to the root.");
//            return false;  // invoke this line if copying to the root is forbidden
          }
          instance.message.set("Recursively copying nodes.");
          Meteor.call('copyNode', item, data.parent);
        },
        move(e, item, data) {
          if (data.parent == '#') {
            instance.message.set("Moving to the root.");
//            return false;  // invoke this line if moving to the root is forbidden
          }
          instance.message.set("Recursively moving nodes.");
          return Meteor.call('updateFileParent', item, data.parent);
        }
      }
    }

    if (!this.create()) delete config.events.create;
    if (!this.rename()) delete config.events.rename;
    if (!this.delete()) delete config.events.delete;
    if (!this.copy()) delete config.events.copy;
    if (!this.move()) delete config.events.move;

    if (this.getNodes()) config.getNodes = function (parent) {
      return TreeData.find({ parent }, { sort: { name: -1 } });
    }

    let configString = JSON.stringify(config, function (key, value) {
      if (key === '__proto__') {
        return undefined;
      }
      if (key === 'collection') {
        return '%%collection%%';
      }
      if (typeof value === 'function') {
        if (key === 'getNodes') return '%%function(parent) {…}%%';
        if (key === 'aAttr') return '%%function(item) {…}%%';
        return '%%function(e, item, data) {…}%%';
      }
      return value;
    }, 2);

    configString = configString.replace(/"?'?%%"?'?/g, '').replace(/\n/g, '\n  ');
    configString = 'Template.templatename.helpers({\n  treeArgs: ' + configString + '\n});';

    this.configurationString(configString);

    return config;
  },
  message() {
    return Template.instance().message.get();
  }
});

Template.Options.viewmodel({
  share: 'options',
  copymoveenable() {
    return this.contextmenu() || this.dnd();
  },
  selectOptions() {
    let options = TreeData.find().map(function (item) {
      return { id: item._id, name: item.name };
    });
    return options;
  },
  resetData() {
    Meteor.call('resetData');
  }
});

Template.Configuration.viewmodel({
  share: 'options',
  configurationRows() {
    return (this.configurationString() + '\n').match(/\n/g).length;
  }
});
