import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

//import './main.html';

Todos = new Mongo.Collection('todos');

//  Todos.insert({
//    name: "Walk the dog",
//    completed: false,
//    createdAt: new Date()
//});

Template.todos.helpers({
    'todo': function(){
        return Todos.find();
    }
});
