(() => {
  class _AdminHelper {
    getListOfUsersToBeUpdated() {
      let selectedUsers = [];
      selectedUsers = $('#selectedUsers option:selected').map(function() {
        return this.value;
      }).get();
      console.log(selectedUsers);
      let usersList = [];
      let thisUser = {};
      for (let i = 0, tot = selectedUsers.length; i < tot; i += 1) {
        thisUser._id = selectedUsers[i];
        usersList.push(thisUser);
        thisUser = {};
        console.log(usersList);
      }
      return usersList;
    }

    getListOfRolesToBeAdded() {
      const addRoles = [];

      if (document.getElementById('roleGraduate').checked) {
        addRoles.push(document.getElementById('roleGraduate').value);
      }

      if (document.getElementById('roleEngineer').checked) {
        addRoles.push(document.getElementById('roleEnginer').value);
      }

      if (document.getElementById('roleSenior').checked) {
        addRoles.push(document.getElementById('roleSenior').value);
      }

      if (document.getElementById('rolePrincipal').checked) {
        addRoles.push(document.getElementById('rolePrincipal').value);
      }

      if (document.getElementById('roleLead').checked) {
        addRoles.push(document.getElementById('roleLead').value);
      }

      if (document.getElementById('roleManager').checked) {
        addRoles.push(document.getElementById('roleManager').value);
      }

      if (document.getElementById('roleDirector').checked) {
        addRoles.push(document.getElementById('roleDirector').value);
      }

      if (document.getElementById('roleAdministrator').checked) {
        addRoles.push(document.getElementById('roleAdministrator').value);
      }
      return addRoles;
    }
  }

  // export an instance into global Meteor namespace
  this.AdminHelper = new _AdminHelper();

  // export the class into the module system
  if (typeof (module) !== 'undefined') {
    module.exports = _AdminHelper;
  }
}).call(this);
