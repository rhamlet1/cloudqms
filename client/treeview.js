ViewModel.share({
  options: {
    create: true,
    rename: true,
    delete: true,
    copy: true,
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

function recursiveCopy(id, parent) {
  let item = myFiles.findOne(id);
  delete item._id;
  item.parent = parent;
  let newId = myFiles.insert(item);

  myFiles.find({ 'metadata.parent': id }).forEach(function (item) {
    recursiveCopy(item._id, newId);
  });
}

function recursiveDelete(id) {
  myFiles.find({ 'metadata.parent': id }).forEach(function (item) {
    recursiveDelete(item._id);
  });
  myFiles.remove(id);
}

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
      collection: myFiles,
      subscription: 'allFiles',
      parent: this.parentNode(),
      select: this.selectNode(),
      openAll: this.openAll(),
      selectAll: this.selectAll(),
      mapping: {
        text: 'filename',
//        parent: function (item) {
//          thisParent = myFiles.find({ filename: text }).metadata.parent;
//          console.log("thisParent: " + thisParent);
//          return thisParent;
//        },
        aAttr: function (item) {
          return {
            title: item._id
          };
        }
      },
      jstree: { plugins },
      events: {
        changed(e, item, data) {
          // item is an array of id
          // File Collection requires the array to be in the form of a Meteor ObjectID
          const fcId = item['0'];
          console.log('item type: ' + typeof item);
          console.log('fcId type: ' + typeof fcId);
          console.log('data type: ' + typeof data);
          Session.set('selectedFile', data.item_data.filename);
          console.log('changed: ' + data);
          instance.message.set("Changing selection. " + item.length + " nodes are selected.");
        },
        create(e, item, data) {
          instance.message.set("Creating node on " + data.parent);
//          return myFiles.insert({ name: 'New node', parent: data.parent });
            console.log('create: ' + data);
          return Meteor.call('insertFileParent', data.parent);
        },
        rename(e, item, data) {
          instance.message.set("Renaming " + item + " to " + data.text);
          myFiles.update(item, { $set: { name: data.text } });
        },
        delete(e, item, data) {
          instance.message.set("Deleting " + item);
          recursiveDelete(item);
        },
        copy(e, item, data) {
          if (data.parent == '#') {
            instance.message.set("Copying to the root is forbidden.");
            return false;
          }
          instance.message.set("Recursively copying nodes.");
          recursiveCopy(item, data.parent);
        },
        move(e, item, data) {
          if (data.parent == '#') {
            instance.message.set("Moving to the root is forbidden.");
            return false;
          }
          console.log('move: ' + data);
          instance.message.set("Recursively moving nodes.");
//          myFiles.update(item, { $set: { parent: data.parent } });
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
      return myFiles.find({ parent }, { sort: { name: -1 } });
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
