import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import cspace from '../../src/cspace';

chai.use(chaiAsPromised);
chai.should();

describe('error handling', () => {
  context('non-existent hostname', () => {
    const cs = cspace.instance({
      url: 'http://xyzy.qaqaqa',
    });

    it('rejects read', () =>
      cs.read('collectionobjects').should.eventually.be.rejected
        .and.not.contain.keys(['response'])
    );
  });

  context('incorrect port number', () => {
    const cs = cspace.instance({
      url: 'http://localhost:7777/cspace-services',
    });

    it('rejects read', function test() {
      this.timeout(20000);

      return cs.read('collectionobjects').should.eventually.be.rejected
        .and.not.contain.keys(['response']);
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
        .with.property('response')
          .that.has.all.keys(['status', 'statusText', 'headers', 'data'])
          .and.property('status', 401)
    );
  });

  context('non-existent resource', () => {
    const cs = cspace.instance({
      url: 'http://nightly.collectionspace.org:8180/cspace-services',
      username: 'admin@core.collectionspace.org',
      password: 'Administrator',
    });

    it('rejects read with status 404', () =>
      cs.read('collectionobjects/somecsid').should.eventually.be.rejected
        .with.property('response')
          .that.has.all.keys(['status', 'statusText', 'headers', 'data'])
          .and.property('status', 404)
    );
  });
});
