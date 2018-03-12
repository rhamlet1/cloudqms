Meteor.publish('structure', () => {
  return Structures.find({}, { fields: { namePath: true } });
});

Meteor.publish('TreeData', function() {
  return TreeData.find();
});
