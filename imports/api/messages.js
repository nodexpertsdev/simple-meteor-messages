import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Declare Meteor Collection
export const Messages = new Mongo.Collection('messages');

// Attach Schema
Messages.attachSchema(new SimpleSchema({
  text: {
    type: String,
  },
  owner: {
    type: String,
  },
  username: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
}));

// Allow a MiniMongo operation
Messages.allow({
  insert(userId) { return userId; },
});

// Restrict collection actions:
Messages.deny({
  update() { return true; },
  // [Point #2.b] **ONLY** using a server side call, delete a message they own from the system
  remove() { return true; },
});

if (Meteor.isServer) {
  // This code only runs on the server
  // [Point #4.a] Publish all system messages for a logged in user
  Meteor.publish('messages', function messagesPublication() {
    if (!this.userId) {
      this.ready();
      return;
    }

    return Messages.find({}, { sort: { createdAt: -1 } });
  });
}

export const deleteMessage = new ValidatedMethod({
  name: 'messages.delete',

  validate: new SimpleSchema({
    messageId: { type: String }
  }).validator(),

  run({ userId, messageId }) {
    const message = Messages.findOne(messageId);
    // Make sure a message can be deleted only if a user is logged in, and is also its owner
    if(!this.userId || message.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Messages.remove(messageId);
  }
});
