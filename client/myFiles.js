Template.dragArea.rendered = function(){
  // This assigns a file upload drop zone to some DOM node
  myFiles.resumable.assignDrop($(".fileDrop"));

  // This assigns a browse action to a DOM node
  myFiles.resumable.assignBrowse($(".fileBrowse"));
}

Template.dragArea.helpers({
  'myFiles': function(){
      return myFiles.files.find({});
  },
});

// When a file is added via drag and drop
myFiles.resumable.on('fileAdded', function (file) {

  // Create a new file in the file collection to upload
  myFiles.insert({
    _id: file.uniqueIdentifier,  // This is the ID resumable will use
    filename: file.fileName,
    contentType: file.file.type
    },
    function (err, _id) {  // Callback to .insert
      if (err) { return console.error("File creation failed!", err); }
      // Once the file exists on the server, start uploading
      myFiles.resumable.upload();
    }
  );
});

// This autorun keeps a cookie up-to-date with the Meteor Auth token
// of the logged-in user. This is needed so that the read/write allow
// rules on the server can verify the userId of each HTTP request.
Deps.autorun(function () {
  // Sending userId prevents a race condition
  Meteor.subscribe('myData', Meteor.userId());
  // $.cookie() assumes use of "jquery-cookie" Atmosphere package.
  // You can use any other cookie package you may prefer...
  $.cookie('X-Auth-Token', Accounts._storedLoginToken(), { path: '/' });
});
