/* global FormData */

import chai from 'chai';
import agent from '../../src/agent';

const { expect } = chai;

chai.should();

describe('agent', () => {
  describe('getConfig()', () => {
    it('should convert the config to an axios config', () => {
      const config = {
        operation: 'read',
        resource: 'collectionobjects/2a4ac4bb-9e44-47ae-942e',
        url: 'http://demo.collectionspace.org/cspace-services',
        username: 'user@collectionspace.org',
        password: 'secret',
        params: {
          pgSz: 20,
          pgNum: 5,
          wf_deleted: false,
          kw: 'lobster',
          sortBy: 'collectionspace_core:updatedAt',
        },
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.be.an('object');
      axiosConfig.should.have.property('url').that.equals(config.resource);
      axiosConfig.should.have.property('method').that.equals('GET');
      axiosConfig.should.have.property('baseURL').that.equals(config.url);
      axiosConfig.should.have.property('headers').that.deep.equals({});
      axiosConfig.should.have.property('params').that.deep.equals(config.params);
      axiosConfig.should.have.nested.property('paramsSerializer.serialize').that.is.a('function');

      axiosConfig.should.have.property('auth').that.deep.equals({
        username: 'user@collectionspace.org',
        password: 'secret',
      });
    });

    it('should set the url to the resource url', () => {
      const config = {
        resource: 'collectionobjects/2a4ac4bb-9e44-47ae-942e',
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('url').that.equals(config.resource);
    });

    it('should set the method to POST for create operations', () => {
      const config = {
        operation: 'create',
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('method').that.equals('POST');
    });

    it('should set the method to GET for read operations', () => {
      const config = {
        operation: 'read',
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('method').that.equals('GET');
    });

    it('should set the method to PUT for update operations', () => {
      const config = {
        operation: 'update',
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('method').that.equals('PUT');
    });

    it('should set the method to DELETE for delete operations', () => {
      const config = {
        operation: 'delete',
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('method').that.equals('DELETE');
    });

    it('should set the base url to the url', () => {
      const config = {
        url: 'http://demo.collectionspace.org/cspace-services',
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('baseURL').that.equals(config.url);
    });

    it('should set a bearer authorization header if a token is present', () => {
      const config = {
        username: 'user@collectionspace.org',
        password: 'secret',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('headers').that.includes({
        Authorization: `Bearer ${config.token}`,
      });
    });

    it('should not set an authorization header if the token is empty', () => {
      const config = {
        token: '',
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('headers').that.does.not.contain.keys('Authorization');
    });

    it('should not set an authorization header if the token is null', () => {
      const config = {
        token: null,
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('headers').that.does.not.contain.keys('Authorization');
    });

    it('should not set an authorization header if the token is undefined', () => {
      const config = {
        token: undefined,
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('headers').that.does.not.contain.keys('Authorization');
    });

    it('should not set an authorization header if no token is present', () => {
      const config = {};

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('headers').that.does.not.contain.keys('Authorization');
    });

    it('should set a content type header if a type is present', () => {
      const config = {
        type: 'image/jpeg',
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('headers').that.includes({
        'Content-Type': 'image/jpeg',
      });
    });

    it('should set a content type header with a charset if type is json', () => {
      const config = {
        type: 'application/json',
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('headers').that.includes({
        'Content-Type': 'application/json;charset=utf-8',
      });
    });

    it('should set a content type header with a charset if type is form', () => {
      const config = {
        type: 'application/x-www-form-urlencoded',
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('headers').that.includes({
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      });
    });

    it('should not set a content type header if the type is empty', () => {
      const config = {
        type: '',
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('headers').that.does.not.contain.keys('Content-Type');
    });

    it('should not set a content type header if the type is null', () => {
      const config = {
        type: null,
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('headers').that.does.not.contain.keys('Content-Type');
    });

    it('should not set a content type header if the type is undefined', () => {
      const config = {
        type: undefined,
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('headers').that.does.not.contain.keys('Content-Type');
    });

    it('should set the params to the params', () => {
      const config = {
        params: {
          pgSz: 100,
          pgNum: 3,
          wf_deleted: false,
          kw: 'necklace',
          sortBy: 'collectionspace_core:updatedAt',
        },
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('params').that.deep.equals(config.params);
    });

    it('should serialize array parameters as multiple query string parameters with the same key', () => {
      const params = {
        mode: ['single', 'group'],
      };

      const axiosConfig = agent.getConfig({});

      axiosConfig.paramsSerializer.serialize(params).should.equal('mode=single&mode=group');
    });

    context('when type is application/x-www-form-urlencoded', () => {
      it('should convert the data to a url-encoded parameter string', () => {
        const config = {
          data: {
            objectNumber: '2016.1.1',
            description: 'A museum object',
          },
          type: 'application/x-www-form-urlencoded',
        };

        const axiosConfig = agent.getConfig(config);

        axiosConfig.should.have.property('data').that
          .equals('objectNumber=2016.1.1&description=A+museum+object');
      });

      it('should encode non-ascii characters in the data', () => {
        const config = {
          data: {
            objectNumber: '2016.1.1',
            description: 'åéîøü',
          },
          type: 'application/x-www-form-urlencoded',
        };

        const axiosConfig = agent.getConfig(config);

        axiosConfig.should.have.property('data').that
          .equals('objectNumber=2016.1.1&description=%C3%A5%C3%A9%C3%AE%C3%B8%C3%BC');
      });

      it('should encode puctuation in the data', () => {
        const config = {
          data: {
            objectNumber: '2016.1.1',
            description: 'this & that = "something"',
          },
          type: 'application/x-www-form-urlencoded',
        };

        const axiosConfig = agent.getConfig(config);

        axiosConfig.should.have.property('data').that
          .equals('objectNumber=2016.1.1&description=this+%26+that+%3D+%22something%22');
      });
    });

    context('when type is multipart/form-data', () => {
      const isNode = (typeof window === 'undefined');

      it('should convert the data to a built-in FormData object in node', function test() {
        if (!isNode) {
          this.skip();
        }

        const config = {
          data: {
            objectNumber: '2016.1.1',
            description: 'A museum object',
          },
          type: 'multipart/form-data',
        };

        const axiosConfig = agent.getConfig(config);

        axiosConfig.should.have.property('data').that.is.instanceOf(FormData);
      });

      it('should set the content type header to have a boundary in node when there is no built-in FormData', function test() {
        if (!isNode || (typeof FormData !== 'undefined')) {
          this.skip();
        }

        const config = {
          data: {
            objectNumber: '2016.1.1',
            description: 'A museum object',
          },
          type: 'multipart/form-data',
        };

        const axiosConfig = agent.getConfig(config);

        axiosConfig.should.have.nested.property('headers.Content-Type').that
          .matches(/^multipart\/form-data; boundary=/);
      });

      it('should convert the data to a built-in FormData object in a browser', function test() {
        if (isNode) {
          this.skip();
        }

        const config = {
          data: {
            objectNumber: '2016.1.1',
            description: 'A museum object',
          },
          type: 'multipart/form-data',
        };

        const axiosConfig = agent.getConfig(config);

        axiosConfig.should.have.property('data').that.is.instanceOf(FormData);
      });
    });

    context('when type is something else', () => {
      it('should set data to the data', () => {
        const config = {
          data: {
            objectNumber: '2016.1.1',
            description: 'A museum object',
          },
          type: '',
        };

        const axiosConfig = agent.getConfig(config);

        axiosConfig.should.have.property('data').that.deep.equals(config.data);
      });
    });

    it('should set auth to null if a token is present', () => {
      const config = {
        username: 'user@collectionspace.org',
        password: 'secret',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      };

      const axiosConfig = agent.getConfig(config);

      expect(axiosConfig.auth).to.equal(null);
    });

    it('should set auth username and password if the token is empty', () => {
      const config = {
        username: 'user@collectionspace.org',
        password: 'secret',
        token: '',
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('auth').that.deep.equals({
        username: config.username,
        password: config.password,
      });
    });

    it('should set auth username and password if the token is null', () => {
      const config = {
        username: 'user@collectionspace.org',
        password: 'secret',
        token: null,
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('auth').that.deep.equals({
        username: config.username,
        password: config.password,
      });
    });

    it('should set auth username and password if the token is undefined', () => {
      const config = {
        username: 'user@collectionspace.org',
        password: 'secret',
        token: undefined,
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('auth').that.deep.equals({
        username: config.username,
        password: config.password,
      });
    });

    it('should set auth username and password if no token is present', () => {
      const config = {
        username: 'user@collectionspace.org',
        password: 'secret',
      };

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('auth').that.deep.equals({
        username: config.username,
        password: config.password,
      });
    });

    it('should set auth to null if both username and password are undefined', () => {
      const config = {};

      const axiosConfig = agent.getConfig(config);

      axiosConfig.should.have.property('auth').that.equals(null);
    });
  });
});
