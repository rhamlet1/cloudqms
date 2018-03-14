import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Structures = new Mongo.Collection('structures');

Template.main.helpers({
  currentUser: () => Meteor.userId(),
});

Template.structures.helpers({
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

Template.qmsTree.helpers({
  'treeArgs': {
    collection: TreeData,
    subscription: 'TreeData',
    mapping: {
      text: 'name',
      aAttr: function (item) {
        return {
          title: item._id
        };
      }
    },
    events: {
      changed: function(e, item) {
        console.log("Item " + item + "selected.");
      }
    }
  }
});
