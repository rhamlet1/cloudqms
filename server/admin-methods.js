Meteor.methods({
  setUserRoles: (thisUserId, roles, group) => {
    check(thisUserId, Object);
    check(roles, [String]);
    check(group, String);
    Roles.setUserRoles(thisUserId, roles, group);
  },

  insertActivityLog: (thisUserId, collectionName, documentId, activity) => {
    check(thisUserId, String);
    check(collectionName, String);
    check(documentId, String);
    check(activity, String);
    const thisDate = new Date();
    return ActivityLog.insert({
      userId: thisUserId,
      collectionName,
      documentId,
      activity,
      dateTime: thisDate,
    });
  }
});
