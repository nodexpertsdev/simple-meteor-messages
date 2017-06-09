/*
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';
import { chai } from 'meteor/practicalmeteor:chai';
import StubCollections from 'meteor/hwillson:stub-collections';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import { sinon } from 'meteor/practicalmeteor:sinon';


import { withRenderedTemplate } from './test-helpers.js';
import { Messages } from './../../api/messages';
import './../message.js';

describe.skip('Message_page', function () {
  const messageId = Random.id();

  beforeEach(function () {
    StubCollections.stub(Messages);
    Template.registerHelper('_', key => key);

    sinon.stub(Meteor, 'subscribe', () => ({
      subscriptionId: 0,
      ready: () => true,
    }));
  });

  afterEach(function () {
    StubCollections.restore();
    Template.deregisterHelper('_');
    Meteor.subscribe.restore();
  });

  it('renders correctly with simple data', function () {
    Factory.create('message', { _id: messageId });
    const timestamp = new Date();
    const messages = _.times(3, i => Factory.create('message', {
      messageId,
      createdAt: new Date(timestamp - (3 - i)),
    }));

    withRenderedTemplate('Message_details', {}, (el) => {
      const messagesText = messages.map(t => t.text).reverse();
      const renderedText = $(el).find('.text input[type=text]')
        .map((i, e) => $(e).val())
        .toArray();
      chai.assert.deepEqual(renderedText, messagesText);
    });
  });
});
*/