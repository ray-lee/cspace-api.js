/* global globalThis */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import cspace from '../../src/cspace';

const { expect } = chai;

chai.use(chaiAsPromised);
chai.should();

describe('error handling', function suite() {
  this.timeout(20000);

  const url = `${globalThis.TEST_BACKEND}/cspace-services`;

  context('non-existent hostname', () => {
    const cs = cspace({
      url: 'http://xyzy.qaqaqa',
    });

    it('rejects read', () => cs.read('collectionobjects').should.eventually
      .be.rejected
      .and.have.all.keys(['name', 'code', 'message', 'response'])
      .and.have.property('response', undefined));
  });

  context('incorrect port number', () => {
    const cs = cspace({
      url: 'http://localhost:7777/cspace-services',
    });

    it('rejects read', () => cs.read('collectionobjects').should.eventually
      .be.rejected
      .and.have.all.keys(['name', 'code', 'message', 'response'])
      .then((error) => {
        if (error.response) {
          // MS Edge returns a 502 Bad Gateway response.
          return error.response.should.have.property('status', 502);
        }

        // Other browsers return no response.
        return expect(error.response).to.equal(undefined);
      }));
  });

  context(`incorrect password on ${url}`, () => {
    const cs = cspace({
      url,
      username: 'admin@core.collectionspace.org',
      password: 'Wrong',
    });

    it('rejects read with status 401', () => cs.read('collectionobjects').should.eventually
      .be.rejected
      .and.have.all.keys(['name', 'code', 'message', 'response'])
      .and.have.property('response')
      .that.has.all.keys(['status', 'statusText', 'headers', 'data'])
      .and.has.property('status', 401));
  });

  context(`non-existent resource on ${url}`, () => {
    const cs = cspace({
      url,
      username: 'admin@core.collectionspace.org',
      password: 'Administrator',
    });

    it('rejects read with status 404', () => cs.read('collectionobjects/badcsid').should.eventually
      .be.rejected
      .and.have.all.keys(['name', 'code', 'message', 'response'])
      .and.have.property('response')
      .that.has.all.keys(['status', 'statusText', 'headers', 'data'])
      .and.has.property('status', 404));
  });
});
