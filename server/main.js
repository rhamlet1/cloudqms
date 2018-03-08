import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Todos = new Mongo.Collection('todos');

Meteor.startup(() => {
  // code to run on server at startup
  // Insert sample data if the student collection is empty
  if (Todos.find().count() === 0) {
    JSON.parse(Assets.getText("todos.json")).todos.forEach(function (doc) {
      Todos.insert(doc);
    });
  }

});
