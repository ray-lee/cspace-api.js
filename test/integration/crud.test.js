import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import cspace from '../../src/cspace';

chai.use(chaiAsPromised);
chai.should();

const instanceConfig = {
  url: 'https://core.dev.collectionspace.org/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
};

describe(`crud operations on ${instanceConfig.url}`, function suite() {
  this.timeout(20000);

  const cs = cspace(instanceConfig);
  const objectNumber = `TEST.${Date.now()}`;
  const comment = `Created by cspace-api.js ${(new Date()).toISOString()}`;

  let objectCsid = '';

  it('can create an object record', () => {
    const config = {
      data: {
        document: {
          '@name': 'collectionobjects',
          'ns2:collectionobjects_common': {
            '@xmlns:ns2': 'http://collectionspace.org/services/collectionobject',
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            objectNumber,
            comments: {
              comment,
            },
          },
        },
      },
    };

    return cs.create('collectionobjects', config).should.eventually
      .include({ status: 201 })
      .and.have.nested.property('headers.location').that.is.ok
      .then((location) => {
        objectCsid = location.substring(location.lastIndexOf('/') + 1);
      });
  });

  it('can find the record', function test() {
    if (!objectCsid) {
      this.skip();
    }

    const config = {
      params: {
        pgSz: 5,
        pgNum: 0,
        as: `collectionobjects_common:objectNumber ILIKE "%${objectNumber}%"`,
        wf_deleted: false,
      },
    };

    return cs.read('collectionobjects', config).should.eventually
      .include({ status: 200 })
      .and.have.property('data')
      .with.property('ns2:abstract-common-list')
      .with.property('list-item')
      .with.property('csid', objectCsid);
  });

  it('can read the record', function test() {
    if (!objectCsid) {
      this.skip();
    }

    return cs.read(`collectionobjects/${objectCsid}`).should.eventually
      .include({ status: 200 })
      .and.have.property('data')
      .with.property('document')
      .with.property('ns2:collectionobjects_common')
      .that.includes({ objectNumber })
      .and.has.property('comments')
      .with.property('comment', comment);
  });

  it('can update the record', function test() {
    if (!objectCsid) {
      this.skip();
    }

    const commentUpdate = `Updated at ${Date.now()}`;

    const config = {
      data: {
        document: {
          '@name': 'collectionobjects',
          'ns2:collectionobjects_common': {
            '@xmlns:ns2': 'http://collectionspace.org/services/collectionobject',
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            comments: {
              comment: commentUpdate,
            },
          },
        },
      },
    };

    return cs.update(`collectionobjects/${objectCsid}`, config).should.eventually
      .include({ status: 200 })
      .and.have.property('data')
      .with.property('document')
      .with.property('ns2:collectionobjects_common')
      .that.includes({ objectNumber })
      .and.has.property('comments')
      .with.property('comment', commentUpdate);
  });

  it('can delete the record', function test() {
    if (!objectCsid) {
      this.skip();
    }

    return cs.delete(`collectionobjects/${objectCsid}`).should.eventually
      .include({ status: 200 });
  });
});
