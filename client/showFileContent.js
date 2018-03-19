Template.showFileContent.onCreated(() => {
  Session.set('selectedFile', 'empty');
});

Template.showFileContent.onRendered(function () {
    const w = document.getElementById("fileBrowse").clientWidth;
//    console.log("divWidth set: " + w.toString());
    Session.set('elementWidth', w.toString());
});

Template.showFileContent.helpers({
  'fileUpload': function () {
    const selectedFile = Session.get('selectedFile');
    console.log("fileUpload selectedFileId: " + selectedFile);
    const mySelectedFile = myFiles.findOne({ _id: selectedFile });
    console.log("fileUpload selectedFileName: " + mySelectedFile.filename);
    return mySelectedFile.filename;
  },
  'myFile': function () {
    const selectedFile = Session.get('selectedFile');
    console.log("myFile: " + selectedFile);
    const mySelectedFile = myFiles.findOne({ _id: selectedFile });
    console.log("myFile mySelectedFile: " + myFiles.baseURL + '/' + mySelectedFile.md5);
    return myFiles.baseURL + '/' + mySelectedFile.md5;
  },
  'contentType': function () {
    const selectedFile = Session.get('selectedFile');
    console.log("contentType selectedFileId: " + selectedFile);
    const mySelectedFile = myFiles.findOne({ _id: selectedFile });
    console.log("contentType selectedContentType: " + mySelectedFile.contentType);
    return mySelectedFile.contentType;
  },
});
