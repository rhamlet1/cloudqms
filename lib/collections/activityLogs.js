import SimpleSchema from 'simpl-schema';

ActivityLog = new Mongo.Collection('activityLog');

ActivityLog.attachSchema(new SimpleSchema({
  userId: {
    type: String,
    label: 'User Id',
  },
  collectionName: {
    type: String,
    label: 'Collection name',
  },
  documentId: {
    type: String,
    label: 'Document Id',
  },
  activity: {
    type: String,
    label: 'Activity',
  },
  dateTime: {
    type: Date,
    label: 'Timestamp',
  },
}));
