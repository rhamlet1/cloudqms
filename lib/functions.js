logActivity = (thisUserId, collectionName, documentId, activity) => {
  Meteor.call(
    'insertActivityLog',
    thisUserId,
    collectionName,
    documentId,
    activity,
  );
};

getUserName = () => {
  const userName = Meteor.user().profile.forename + ' ' + Meteor.user().profile.surname;
  return userName;
};

getPersonName = (thisUserId) => {
  const thisUser = Meteor.users.findOne({ _id: thisUserId });
  if (thisUser === undefined ) {
    return '';
  } else {
    return thisUser.profile.forename + ' ' + thisUser.profile.surname;
  }
};
