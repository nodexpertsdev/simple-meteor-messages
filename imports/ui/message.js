import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './message.html';
import { deleteMessage } from './../api/messages';

Template.message.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});

Template.message.events({
  'click .delete'() {
    // [Point #2.a] Delete a message they own from the system, using a server side call
    deleteMessage.call({ messageId: this._id });
  },
});
