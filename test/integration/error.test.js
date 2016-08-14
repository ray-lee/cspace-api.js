import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import cspace from '../../src/cspace';

const expect = chai.expect;

chai.use(chaiAsPromised);
chai.should();

describe('error handling', function suite() {
  this.timeout(20000);

  context('non-existent hostname', () => {
    const cs = cspace.instance({
      url: 'http://xyzy.qaqaqa',
    });

    it('rejects read', () =>
      cs.read('collectionobjects').should.eventually.be.rejected
        .and.have.all.keys(['name', 'code', 'message', 'response'])
        .and.property('response', undefined));
  });

  context('incorrect port number', () => {
    const cs = cspace.instance({
      url: 'http://localhost:7777/cspace-services',
    });

    it('rejects read', function test() {
      return cs.read('collectionobjects').should.eventually.be.rejected
        .and.have.all.keys(['name', 'code', 'message', 'response'])
        .then((error) => {
          if (error.response) {
            // MS Edge returns this as a 502 Bad Gateway response.
            return error.response.should.have.property('status', 502);
          }

          // Other browsers return no response.
          return expect(error.response).to.equal(undefined);
        });
    });
  });

  context('incorrect password', () => {
    const cs = cspace.instance({
      url: 'http://nightly.collectionspace.org:8180/cspace-services',
      username: 'admin@core.collectionspace.org',
      password: 'Wrong',
    });

    it('rejects read with status 401', () =>
      cs.read('collectionobjects').should.eventually.be.rejected
        .and.have.all.keys(['name', 'code', 'message', 'response'])
        .and.property('response')
          .that.has.all.keys(['status', 'statusText', 'headers', 'data'])
          .and.property('status', 401));
  });

  context('non-existent resource', () => {
    const cs = cspace.instance({
      url: 'http://nightly.collectionspace.org:8180/cspace-services',
      username: 'admin@core.collectionspace.org',
      password: 'Administrator',
    });

    it('rejects read with status 404', () =>
      cs.read('collectionobjects/somecsid').should.eventually.be.rejected
        .and.have.all.keys(['name', 'code', 'message', 'response'])
        .and.property('response')
          .that.has.all.keys(['status', 'statusText', 'headers', 'data'])
          .and.property('status', 404));
  });
});
