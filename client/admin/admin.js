Meteor.subscribe('allFiles');
const dateTo = new Date();
const dateFrom = new Date();
dateFrom.setTime(0);
Session.set('searchDateFrom', dateFrom);
Session.set('searchDateTo', dateTo);


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
});

Template.dragArea.events({
  'click .fileName': function(){
    console.log("this.filename: " + this.filename);
    Session.set('selectedFile', this.filename);
  },
});

// When a file is added via drag and drop
myFiles.resumable.on('fileAdded', function (file) {

  const fileId = file.uniqueIdentifier;  // This is the ID resumable will use
  console.log('fileId typeof: ' + typeof fileId);
  console.log('fileId: ' + fileId);
  // Create a new file in the file collection to upload
  myFiles.insert({
    _id: fileId,
    filename: file.fileName,
    contentType: file.file.type
    },
    function (err, _id) {  // Callback to .insert
      if (err) { return console.error("File creation failed!", err); }
      // Once the file exists on the server, start uploading
      myFiles.resumable.upload();
    }
  );

  TreeData.insert({
    _id: fileId,
    name: file.fileName,
    parent: null
  });

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

Template.manageRoles.helpers({
  options: () => {
    let optionsList = '';
    // create a list of visible fields
    let allUsers = Meteor.users.find({},{ sort: { emails: 1 } }).map((thisUser) => {
      return { userId: thisUser._id, userEmail: thisUser.emails[0].address };
    });
    // generate html code to display the table header row
    allUsers.forEach((thisUser) => {
      optionsList = optionsList + '<option value="' + thisUser.userId + '">' + thisUser.userEmail + '</option>';
    });
    return optionsList;
  },
  checkboxes: () => {
    const userRoles = ['graduate', 'engineer', 'senior', 'principal', 'lead', 'manager', 'director', 'administrator'];
    const userGroups = ['staff', 'contractor', 'HSEQ', 'engineering', 'management'];
    let userRolesList = '';

    userRoles.forEach((userRole) => {
      const stringLength = userRole.length;
      const firstLetter = userRole.slice(0, 1).toUpperCase()
      const userRoleLabel = userRole.slice(0, 1).toUpperCase() + userRole.slice(1);
      const userRoleId = 'role' + userRoleLabel;
console.log(userRole + ', ' + userRoleLabel + ', ' + userRoleId);
      userRolesList = userRolesList +
        '<div class="checkbox col-sm-offset-1 col-sm-10">' +
          '<label>' +
            '<input type="checkbox" id="' + userRoleId + '" value="' + userRole + '">' +
            userRoleLabel +
          '</label>' +
        '</div>';
    });

    console.log(userRolesList);
    return userRolesList;
  },
});

Template.manageRoles.events({
  'click [name=addRoles]': () => {
    const selectedUsers = AdminHelper.getListOfUsersToBeUpdated();
    const addRoles = AdminHelper.getListOfRolesToBeAdded();
    const group = '';

    selectedUsers.forEach((selectedUser) => {
//      console.log(selectedUser._id);
      Meteor.call(
        'setUserRoles',
        selectedUser,
        addRoles,
        group,
        function (error) {
          if (error) {
            const activity = 'User role(s) update for ' + getPersonName(selectedUser._id) +
             ' by ' + getUserName() + ' failed.';
            logActivity(
              selectedUser._id,
              'Users',
              selectedUser._id,
              activity,
            );
          } else {
            const activity = 'User role(s) updated for ' + getPersonName(selectedUser._id) +
             ' by ' + getUserName() + '.';
            logActivity(
              selectedUser._id,
              'Users',
              selectedUser._id,
              activity,
            );
            alert('User roles updated');
          }
        },
      );
    });
  },
  'click [name=cancel]': () => {
    history.go(-1);
  },
});

Template.viewActivityLog.onCreated(() => {
  Session.set('selectedField', 'dateTime');
});

Template.viewActivityLog.onRendered(() => {
  const dateNow = new Date();
  this.$('.datetimepicker').datetimepicker({
    defaultDate: dateNow
  });
});

Template.viewActivityLog.helpers({
  activityLog: () => {
    const selectedField = Session.get('selectedField');
    const sort = {};
    sort[selectedField] = 1; // first order sort
    sort.dateTime = -1;  // second order sort
    const options = {};
    options.sort = sort;

// set the activity log search to 3 days before current day for convenience
// need to write a user specified function
    const searchDateFrom = Session.get('searchDateFrom');
    const searchDateTo = Session.get('searchDateTo');
//    console.log(searchDateFrom);
//    console.log(searchDateTo);

    return ActivityLog.find({ dateTime: { $gte: searchDateFrom, $lte: searchDateTo } }, options);
  },
});

Template.viewActivityLog.events({
  'click [name=closeActivityLog]': () => {
    history.go(-1);
  },
  'click th': (event) => {
    const headerField = event.currentTarget.id;
    Session.set('selectedField', headerField);
  },
  'click [name=optionsRadios]': (event) => {
//    console.log(event.currentTarget.value);
    const searchDateTo = new Date();
    const searchDateFrom = new Date();
    const milliseconds = Date.now();
    switch (event.currentTarget.value) {
      case 'option1':
      // today
        searchDateFrom.setTime(milliseconds - (1000 * 24 * 60 * 60 * 1));
//        console.log(searchDateFrom);
//        console.log(searchDateTo);
        Session.set('searchDateFrom', searchDateFrom);
        Session.set('searchDateTo', searchDateTo);
        break;
      case 'option2':
      // 3 days
        searchDateFrom.setTime(milliseconds - (1000 * 24 * 60 * 60 * 3));
//        console.log(searchDateFrom);
//        console.log(searchDateTo);
        Session.set('searchDateFrom', searchDateFrom);
        Session.set('searchDateTo', searchDateTo);
        break;
      case 'option3':
      // 1 week
        searchDateFrom.setTime(milliseconds - (1000 * 24 * 60 * 60 * 7));
//        console.log(searchDateFrom);
//        console.log(searchDateTo);
        Session.set('searchDateFrom', searchDateFrom);
        Session.set('searchDateTo', searchDateTo);
        break;
      case 'option4':
      // date range
//        console.log($('#dpFrom').data("DateTimePicker").date().toDate());
//        console.log($('#dpTo').data("DateTimePicker").date().toDate());
        searchDateFrom.setTime(0);
//        console.log(searchDateFrom);
//        console.log(searchDateTo);
        Session.set('searchDateFrom', $('#dpFrom').data("DateTimePicker").date().toDate());
        Session.set('searchDateTo', $('#dpTo').data("DateTimePicker").date().toDate());
        break;
      default:
        alert('You have a strange Mouse!');
    }
  },
  'click .dateFrom': (e) => {
    const thisDate = $('#dpFrom').data("DateTimePicker").date().toDate();
//    console.log(thisDate);
    const optionsRadioValue = $('input[name="optionsRadios"]:checked').val();
//    console.log(optionsRadioValue);
    $('#dpTo').data("DateTimePicker").minDate(thisDate);
    if (optionsRadioValue === 'option4') {
      Session.set('searchDateFrom', $('#dpFrom').data("DateTimePicker").date().toDate());
    }
  },
  'click .dateTo': (e) => {
    const thisDate = $('#dpTo').data("DateTimePicker").date().toDate();
//    console.log(thisDate);
    const optionsRadioValue = $('input[name="optionsRadios"]:checked').val();
//    console.log(optionsRadioValue);
    $('#dpFrom').data("DateTimePicker").maxDate(thisDate);
//    console.log($('#dpTo').data("DateTimePicker").date().toDate());
    if (optionsRadioValue === 'option4') {
      Session.set('searchDateTo', $('#dpTo').data("DateTimePicker").date().toDate());
    }
  },
});
