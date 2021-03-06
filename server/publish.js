Meteor.publish('structure', () => {
  return Structures.find({}, { fields: { namePath: true } });
});

Meteor.publish('TreeData', function() {
  return TreeData.find();
});

// Only publish files owned by this userId, and ignore
// file chunks being used by Resumable.js for current uploads
Meteor.publish('myData',
  function (clientUserId) {
    if (clientUserId === this.userId) {
      return myFiles.find({ 'metadata._Resumable': { $exists: false },
                            'metadata.owner': this.userId });
    } else {        // Prevent client race condition:
      return null;  // This is triggered when publish is rerun with a new
                    // userId before client has resubscribed with that userId
    }
  }
);

// not used at present
Meteor.publish('mySelectedFile',
  function (selectedFile) {
      return myFiles.findOne({ 'filename': selectedFile }).get();
  }
);

// Allow rules for security. Should look familiar!
// Without these, no file writes would be allowed
myFiles.allow({
  // The creator of a file owns it. UserId may be null.
  insert: function (userId, file) {
    // Assign the proper owner when a file is created
    file.metadata = file.metadata || {};
    console.log('allow userId: ' + userId);
    file.metadata.owner = userId;
    file.metadata.parent = null;
    return true;
  },
  // Only owners can remove a file
  remove: function (userId, file) {
    // Only owners can delete
    return (userId === file.metadata.owner);
  },
  // Only owners can retrieve a file via HTTP GET
  read: function (userId, file) {
    return (userId === file.metadata.owner);
  },
  // This rule secures the HTTP REST interfaces' PUT/POST
  // Necessary to support Resumable.js
  write: function (userId, file, fields) {
    // Only owners can upload file data
    return (userId === file.metadata.owner);
  }
});

Meteor.publish('userList', () => {
  return Meteor.users.find({}, { fields: { _id: 1, emails: 1, profile: 1 } });
});

Meteor.publish('activityLog', () => {
  return ActivityLog.find({});
});

Meteor.publish('allUsers', () => {
  return Meteor.users.find({}, { fields: { _id: 1, emails: 1, profile: 1 } })
});
