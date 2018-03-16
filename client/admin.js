Meteor.subscribe('allFiles');


Template.dragArea.rendered = function(){
  // This assigns a file upload drop zone to some DOM node
  myFiles.resumable.assignDrop($(".fileDrop"));
}

Template.dragArea.onCreated(() => {
  Session.set('selectedFile', 'empty');
});

Template.dragArea.onRendered(function () {
    const w = document.getElementById("fileBrowse").clientWidth;
    console.log("divWidth set: " + w.toString());
    Session.set('elementWidth', w.toString());
});

Template.dragArea.helpers({
  'myData': function(){
      return myFiles.find({});
  },
<<<<<<< HEAD:client/myFiles.js
  'fileUpload': function () {
    const selectedFile = Session.get('selectedFile');
    console.log("fileUpload: " + selectedFile);
    return selectedFile;
  },
  'myFile': function () {
    const selectedFile = Session.get('selectedFile');
    console.log("myFile: " + selectedFile);
    const mySelectedFile = myFiles.findOne({ 'filename': selectedFile });
//    console.log("mySelectedFile: " + '/gridfs/myFiles/:md5/' + mySelectedFile.md5);
//    return '/gridfs/myFiles/:md5/' + mySelectedFile.md5;
    console.log("mySelectedFile: " + '/home/richard/Pictures/' + selectedFile);
    return '/home/richard/Pictures/"' + selectedFile + '"';
  }
=======
>>>>>>> f7cec6e20cc97e896bb71bea6d214347c485b4b2:client/admin.js
});

Template.dragArea.events({
  'click .fileName': function(){
    console.log("this.filename: " + this.filename);
    Session.set('selectedFile', this.filename);
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
