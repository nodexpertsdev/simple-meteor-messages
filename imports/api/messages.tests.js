/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { expect } from 'meteor/practicalmeteor:chai';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';

import { Messages, deleteMessage } from './messages.js';

if (Meteor.isServer) {
  describe('Messages:', () => {
    // Helper function
    const count = () => Messages.find().count();

    describe('Methods:', () => {
      const userId = Random.id();
      let messageId;

      beforeEach(() => {
        Messages.remove({});
        messageId = Messages.insert({
          text: 'test message',
          createdAt: new Date(),
          owner: userId,
          username: 'nodexperts',
        });
      });

      it('Can delete owned message', () => {
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };
        // Use the imported message method so that we can test it in isolation
        // Run the method with `this` set to the fake invocation
        const deletedMessage = deleteMessage._execute(invocation, { messageId });
        // Verify that the message was deleted
        expect(count()).to.equal(0);
      });

      it('Cannot delete message created by others', () => {
        // Set another random userId in invocation
        const invocation = { userId: Random.id() };
        // Catch and verify that error was thrown
        expect(() => deleteMessage._execute(invocation, { messageId })).to.throw(Meteor.Error, 'not-authorized');
        // Verify that message was not deleted
        expect(count()).to.equal(1);
      });

      it('Cannot delete message while logged out', () => {
        // Do not set userId in invocation
        const invocation = { userId: Random.id() };
        // Catch and verify that error was thrown
        expect(() => deleteMessage._execute(invocation, { messageId })).to.throw(Meteor.Error, 'not-authorized');
        // Verify that message was not deleted
        expect(count()).to.equal(1);
      });
    });

    describe('Publication:', function () {
      const userId = Random.id();
      const otherUserId = Random.id();

      const fakeMessages = [{
        text: 'test message 1',
        owner: userId,
        username: 'userOne',
        createdAt: new Date(),
      }, {
        text: 'test message 2',
        owner: otherUserId,
        username: 'userTwo',
        createdAt: new Date(),
      }];

      before(() => {
        Messages.remove({});
        fakeMessages.map(fakeMessage => {
          Messages.insert(fakeMessage);
        });
      });

      it('Sends all system messages while logged in', function (done) {
        // Set a user id that will be provided to the publish function as `this.userId`,
        // in case you want to test authentication.
        const collector = new PublicationCollector({ userId });
        // Collect the data published from the `messages` publication.
        collector.collect('messages', ({ messages }) => {
          // `collections` is a dictionary with collection names as keys,
          // and their published documents as values in an array.
          // Here, documents from the collection 'messages' are published.
          expect(messages).to.be.an('array');
          expect(messages).to.have.lengthOf(2);
          done();
        });
      });

      it('Does not send any system message while logged out', function (done) {
        // Do not set a userId
        const collector = new PublicationCollector({});
        collector.collect('messages', ({ messages }) => {
          expect(messages).to.equal(undefined);
          done();
        });
      });
    });
  });
}
