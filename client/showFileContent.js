Template.showFileContent.onCreated(() => {
  Session.set('selectedFile', 'empty');
});

Template.showFileContent.onRendered(function () {
    const w = document.getElementById("fileBrowse").clientWidth;
    console.log("divWidth set: " + w.toString());
    Session.set('elementWidth', w.toString());
});

Template.showFileContent.helpers({
  'fileUpload': function () {
    const selectedFile = Session.get('selectedFile');
    console.log("fileUpload: " + selectedFile);
    return selectedFile;
  },
  'myFile': function () {
    const selectedFile = Session.get('selectedFile');
    console.log("myFile: " + selectedFile);
    const mySelectedFile = myFiles.findOne({ 'filename': selectedFile });
    console.log("mySelectedFile: " + myFiles.baseURL + '/' + mySelectedFile.md5);
    return myFiles.baseURL + '/' + mySelectedFile.md5;
  },
});
