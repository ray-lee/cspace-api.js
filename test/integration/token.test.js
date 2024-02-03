/* global globalThis */
import qs from 'qs';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import cspace from '../../src/cspace';

chai.use(chaiAsPromised);
chai.should();

const url = `${globalThis.TEST_BACKEND}/cspace-services`;

const instanceConfig = {
  url,
};

const loginInstanceConfig = {
  url: `${url}/login`,
  type: 'application/x-www-form-urlencoded',
};

const authInstanceConfig = {
  url: `${url}/oauth2`,
  type: 'application/x-www-form-urlencoded',
};

describe(`token operations on ${url}`, function suite() {
  this.timeout(20000);

  const inNode = (typeof window === 'undefined');

  const cs = cspace(instanceConfig);
  const csLogin = cspace(loginInstanceConfig);
  const csAuth = cspace(authInstanceConfig);

  let accessToken = '';
  let objectCsid = '';

  it('can obtain an access token', function test() {
    if (!inNode) {
      // In a browser, axios currently can't be set to not follow redirects, which makes it
      // impossible to execute the oauth authorization code flow.

      this.skip();
    }

    return csLogin.read('')
      .then(({ headers, data }) => {
        const setCookieHeader = headers['set-cookie'][0];
        const cookie = setCookieHeader.split(';')[0];

        const match = data.match(/"token":"(.*?)"/);
        const csrfToken = match[1];

        const config = {
          headers: {
            Cookie: cookie,
          },
          data: {
            username: 'admin@core.collectionspace.org',
            password: 'Administrator',
            _csrf: csrfToken,
          },
          maxRedirects: 0,
        };

        return csLogin.create('', config);
      })
      .then(({ headers }) => {
        const setCookieHeader = headers['set-cookie'][0];
        const cookie = setCookieHeader.split(';')[0];

        const config = {
          headers: {
            Cookie: cookie,
          },
          maxRedirects: 0,
          params: {
            response_type: 'code',
            client_id: 'cspace-ui',
            scope: 'cspace.full',
            redirect_uri: '/../cspace/core/authorized',
            code_challenge: 'Ngi8oeROpsTSaOttsCJgJpiSwLQrhrvx53pvoWw8koI',
            code_challenge_method: 'S256',
          },
        };

        return csAuth.read('/authorize', config);
      })
      .then(({ headers }) => {
        const queryString = headers.location.split('?')[1];
        const params = qs.parse(queryString);

        const config = {
          params: {
            grant_type: 'authorization_code',
            code: params.code,
            redirect_uri: '/../cspace/core/authorized',
            client_id: 'cspace-ui',
            code_verifier: 'xyz',
          },
        };

        return csAuth.create('token', config);
      })
      .should.eventually
      .include({ status: 200 })
      .and.have.property('data').that.contains.all.keys(['access_token'])
      .then((data) => {
        accessToken = data.access_token;
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

  it('can delete the record using the access token', function test() {
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
