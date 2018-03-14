getUserName = () => {
  const userName = Meteor.user().profile.forename + ' ' + Meteor.user().profile.surname;
  return userName;
};
