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
//      parent: this.metadata.parent,
      parent: this.parentNode(),
      select: this.selectNode(),
      openAll: this.openAll(),
      selectAll: this.selectAll(),
      mapping: {
        text: 'filename',
        parent: 'meteor.parent',
/*        parent: function (item) {
          const fcId = new Mongo.ObjectID(item);
          thisParent = myFiles.findOne({ _id: fcId }).metadata.parent;
          console.log("mapping thisParent: " + thisParent);
          return thisParent;
        },
*/
        aAttr: function (item) {
          return {
            title: item._id
          };
        }
      },
      jstree: { plugins },
      events: {
        changed(e, item, data) {
          // item is an array of id strings
          // File Collection requires the array to be in the form of a Meteor ObjectID
          console.log('changed item typeof: ' + typeof item);
          console.log('changed item : ' +  item);
          const fcId = new Mongo.ObjectID(item['0']);
          console.log('changed fcId typeof: ' + typeof fcId);
          console.log('changed fcId: ' + typeof fcId);
//          console.log('changed: ' + data);
          Session.set('selectedFile', fcId);
//          Session.set('selectedFile', item);
//          console.log('changed: ' + data);
          instance.message.set("Changing selection. " + item.length + " nodes are selected.");
        },
        create(e, item, data) {
          console.log('create item typeof: ' + typeof item);
          instance.message.set("Creating node on " + data.parent);
//          return myFiles.insert({ name: 'New node', parent: data.parent });
            console.log('create: ' + data);
          return Meteor.call('insertFileParent', data.parent);
        },
        rename(e, item, data) {
          console.log('rename item typeof: ' + typeof item);
          const fcId = new Mongo.ObjectID(item);
          instance.message.set("Renaming " + fcId + " to " + data.text);
          myFiles.update({ _id: fcId }, { $set: { filename: data.text } });
        },
        delete(e, item, data) {
          console.log('delete item typeof: ' + typeof item);
          const fcId = new Mongo.ObjectID(item);
          instance.message.set("Deleting " + fcId);
          Meteor.call('recursiveDelete', fcId);
        },
        copy(e, item, data) {
          console.log('copy item typeof: ' + typeof item);
          const fcId = new Mongo.ObjectID(item);
          if (data.parent == '#') {
            instance.message.set("Copying to the root is forbidden.");
            return false;
          }
          instance.message.set("Recursively copying nodes.");
          Meteor.call('recursiveCopy', fcId, data.parent);
        },
        move(e, item, data) {
//          console.log('move item: ' + item);
          console.log('move item typeof: ' + typeof item);
          const fcId = new Mongo.ObjectID(item);
          if (data.parent == '#') {
            instance.message.set("Moving to the root is forbidden.");
            return false;
          }
//          console.log('move data: ' + data);
          instance.message.set("Recursively moving nodes.");
//          myFiles.update(item, { $set: { parent: data.parent } });
          return Meteor.call('updateFileParent', fcId, data.parent);
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
