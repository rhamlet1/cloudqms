import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Structures = new Mongo.Collection('structures');

Meteor.startup(() => {
  // code to run on server at startup
  // ensure structures collection is empty
  Structures.remove({});  // remove this line once server methods are defined
  // Insert sample data if the structures collection is empty
  // the structure.json file replicates the QMS website
  // complete except for the 'Standards' category
  if (Structures.find().count() === 0) {
    JSON.parse(Assets.getText("structure.json")).structures.forEach(function (doc) {
      Structures.insert(doc);
    });
  }

  TreeData.remove({});  // remove this line once server methods are defined
/  // Insert tree data if the TreeData collection is empty
  // the data replicates the QMS website
  let name = '';
  let parent = '#';
  TreeData.insert({name, parent});
  myFiles.find({}).forEach((item) => {

  }
/*
  // complete except for the 'Standards' category
  if(TreeData.find().count() === 0) {
    Meteor.call("resetData");
    console.log("Filled collection TreeData");
  }
*/

  Meteor.publish('allFiles',
    function (selectedFile) {
        return myFiles.find({});
    }
  );


});
