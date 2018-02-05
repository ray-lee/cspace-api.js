import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import cspace from '../../src/cspace';
import base64Encode from '../helpers/base64Encode';

chai.use(chaiAsPromised);
chai.should();

const url = 'http://nightly.collectionspace.org:8180/cspace-services';

const instanceConfig = {
  url,
};

const authInstanceConfig = {
  url: `${url}/oauth`,
  username: 'cspace-ui',
  password: '',
  type: 'application/x-www-form-urlencoded',
};

describe(`token operations on ${url}`, function suite() {
  this.timeout(20000);

  const cs = cspace(instanceConfig);
  const csAuth = cspace(authInstanceConfig);

  let accessToken = '';
  let refreshToken = '';
  let objectCsid = '';

  it('can obtain an access token', () => {
    const config = {
      data: {
        grant_type: 'password',
        username: 'admin@core.collectionspace.org',
        password: base64Encode('Administrator'),
      },
    };

    return csAuth.create('token', config).should.eventually
      .include({ status: 200 })
      .and.have.property('data')
        .that.contains.all.keys(['access_token', 'refresh_token'])
        .then((data) => {
          accessToken = data.access_token;
          refreshToken = data.refresh_token;
        });
  });

  it('can create a record using the access token', function test() {
    if (!accessToken) {
      this.skip();
    }

    const config = {
      data: {
        document: {
          '@name': 'collectionobjects',
          'ns2:collectionobjects_common': {
            '@xmlns:ns2': 'http://collectionspace.org/services/collectionobject',
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            objectNumber: `TEST.${Date.now()}`,
          },
        },
      },
      token: accessToken,
    };

    return cs.create('collectionobjects', config).should.eventually
      .include({ status: 201 })
      .and.have.nested.property('headers.location').that.is.ok
      .then((location) => {
        objectCsid = location.substring(location.lastIndexOf('/') + 1);
      });
  });

  it('can refresh the access token using the refresh token', function test() {
    if (!refreshToken) {
      this.skip();
    }

    const config = {
      data: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
    };

    accessToken = '';
    refreshToken = '';

    return csAuth.create('token', config).should.eventually
      .include({ status: 200 })
      .and.have.property('data')
        .that.contains.all.keys(['access_token', 'refresh_token'])
        .then((data) => {
          accessToken = data.access_token;
          refreshToken = data.refresh_token;
        });
  });

  it('can delete the record using the new access token', function test() {
    if (!accessToken || !objectCsid) {
      this.skip();
    }

    const config = {
      token: accessToken,
    };

    return cs.delete(`collectionobjects/${objectCsid}`, config).should.eventually
      .include({ status: 200 });
  });
});
