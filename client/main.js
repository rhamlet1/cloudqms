import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Structures = new Mongo.Collection('structures');

Template.main.helpers({
  currentUser: () => Meteor.userId(),
});

Template.myNav.events({
  'click .logout': (event) => {
    event.preventDefault();
    Meteor.logout(function(err){
      console.log(err);
    });
  },
});

Template.home.helpers({
  'structure': function(){
      return Structures.find({}, { sort: { 'namePath.0': 1 } });
  },
  'categories': function(){
      let options = "";
      const categoriesList = _.uniq(Structures.find({}, { sort: { 'namePath.0': 1 }, fields: { 'namePath': true } }).map((c) => {
        return c.namePath[0];
      }), true);
//      console.log('categoriesList: ' + categoriesList);
      categoriesList.splice(0,0,' : ');
      categoriesList.forEach((keyValuePair) => {
  //      console.log(keyValuePair);
        const keyValue = keyValuePair.split(':');
  //      console.log(keyValue);
  			options = options + "<option value='" + keyValue[1] + "'>" + keyValue[0] + "</option>";
  		});
  //    console.log(options);
  		return options;
  },
});

/*
Template.qmsTree.helpers({
  'treeArgs': {
    collection: myFiles,
    subscription: 'allFiles',
    mapping: {
      text: 'filename',
      aAttr: function (item) {
        return {
          title: item._id
        };
      }
    },
    events: {
      changed: function(e, item, data) {
        Session.set('selectedFile', data.item_data.filename);
        console.log("Item " + item + " selected.");
        console.log("Item " + data.item_data.filename + " selected.");
      },
      create(e, item, data) {
        instance.message.set("Creating node on " + data.parent);
        return myFiles.insert({ name: 'New node', parent: data.parent });
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
        return instance.message.set("Recursively copying nodes.");
        recursiveCopy(item, data.parent);
      },
      move(e, item, data) {
        if (data.parent == '#') {
          instance.message.set("Moving to the root is forbidden.");
          return false;
        }
        instance.message.set("Recursively moving nodes.");
        myFiles.update(item, { $set: { parent: data.parent } });
      }
    }
  }
});
*/

$.validator.setDefaults({
  rules: {
    // login, register
    email: {
      required: true,
      email: true,
    },
    password: {
      required: true,
      minlength: 6,
    },
    forename: {
      required: true,
    },
    surname: {
      required: true,
    },
    jobTitle: {
      required: true,
    },
    company: {
      required: true,
    },
  },
  messages: {
    // login, register
    email: {
      required: 'You must enter a valid email address.',
      email: 'You have entered an invalid email address.',
    },
    password: {
      required: 'You must enter your password.',
      minlength: 'The password must be a minimum of {0} characters.',
    },
    forename: {
      required: 'You must enter your first name.',
    },
    surname: {
      required: 'You must enter your family name.',
    },
    jobTitle: {
      required: 'You must enter your company position.',
    },
    company: {
      required: 'You must enter your organisation name.',
    },
  },
});
