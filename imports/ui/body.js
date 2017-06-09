import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Messages } from '../api/messages';

import './message.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('messages');
});

Template.body.helpers({
  messages() {
    const instance = Template.instance();
    // [Point #4.b] Return all of the messages in system in descending order of creation
    return Messages.find({}, { sort: { createdAt: -1 } });
  },
  messageCount() {
    return Messages.find({}).count();
  },
});

Template.body.events({
  'submit .new-message'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    if(!text.length) return;

    // [Point #1] Insert a message into the collection without using a server method call
    Messages.insert({
      text,
      owner: Meteor.userId(),
      username: Meteor.user().username,
      createdAt: new Date(), // current time
    });

    // Clear form
    target.text.value = '';
  },
});
