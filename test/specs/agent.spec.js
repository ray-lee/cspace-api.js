import chai from 'chai';
import agent from '../../src/agent';

const expect = chai.expect;

chai.should();

describe('agent', () => {
  describe('getUrl()', () => {
    it('should return the resource url', () => {
      const config = {
        resource: 'collectionobjects/2a4ac4bb-9e44-47ae-942e',
      };

      agent.getUrl(config).should.equal(config.resource);
    });
  });

  describe('getMethod()', () => {
    it('should return POST for create operations', () => {
      const config = {
        operation: 'create',
      };

      agent.getMethod(config).should.equal('POST');
    });


    it('should return GET for read operations', () => {
      const config = {
        operation: 'read',
      };

      agent.getMethod(config).should.equal('GET');
    });

    it('should return PUT for update operations', () => {
      const config = {
        operation: 'update',
      };

      agent.getMethod(config).should.equal('PUT');
    });

    it('should return DELETE for delete operations', () => {
      const config = {
        operation: 'delete',
      };

      agent.getMethod(config).should.equal('DELETE');
    });
  });

  describe('getBaseUrl()', () => {
    it('should return the url', () => {
      const config = {
        url: 'http://demo.collectionspace.org/cspace-services',
      };

      agent.getBaseUrl(config).should.equal(config.url);
    });
  });

  describe('getHeaders()', () => {
    it('should return a bearer authorization header if a token is present', () => {
      const config = {
        username: 'user@collectionspace.org',
        password: 'secret',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      };

      agent.getHeaders(config).should.include({
        Authorization: `Bearer ${config.token}`,
      });
    });

    it('should not return an authorization header if the token is empty', () => {
      const config = {
        token: '',
      };

      agent.getHeaders(config).should.not.contain.keys('Authorization');
    });

    it('should not return an authorization header if the token is null', () => {
      const config = {
        token: null,
      };

      agent.getHeaders(config).should.not.contain.keys('Authorization');
    });

    it('should not return an authorization header if the token is undefined', () => {
      const config = {
        token: undefined,
      };

      agent.getHeaders(config).should.not.contain.keys('Authorization');
    });

    it('should not return an authorization header if no token is present', () => {
      const config = {};

      agent.getHeaders(config).should.not.contain.keys('Authorization');
    });
    
    it('should return a content type header if a type is present', () => {
      const config = {
        type: 'image/jpeg'
      };

      agent.getHeaders(config).should.include({
        'Content-Type': 'image/jpeg',
      });
    });
    
    it('should return a content type header with a charset if type is json', () => {
      const config = {
        type: 'application/json'
      };

      agent.getHeaders(config).should.include({
        'Content-Type': 'application/json;charset=utf-8',
      });
    });
    
    it('should return a content type header with a charset if type is form', () => {
      const config = {
        type: 'application/x-www-form-urlencoded'
      };

      agent.getHeaders(config).should.include({
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      });
    });
    
    it('should not return a content type header if the type is empty', () => {
      const config = {
        type: '',
      };

      agent.getHeaders(config).should.not.contain.keys('Content-Type');
    });

    it('should not return a content type header if the type is null', () => {
      const config = {
        type: null,
      };

      agent.getHeaders(config).should.not.contain.keys('Content-Type');
    });

    it('should not return a content type header if the type is undefined', () => {
      const config = {
        type: undefined,
      };

      agent.getHeaders(config).should.not.contain.keys('Content-Type');
    });
  });

  describe('getParams()', () => {
    it('should return the params', () => {
      const config = {
        params: {
          pgSz: 100,
          pgNum: 3,
          wf_deleted: false,
          kw: 'necklace',
          sortBy: 'collectionspace_core:updatedAt',
        },
      };

      agent.getParams(config).should.deep.equal(config.params);
    });
  });

  describe('getFormData()', () => {
    it('should convert the data to a url-encoded parameter string', () => {
      const data = {
        objectNumber: '2016.1.1',
        description: 'A museum object',
      };

      agent.getFormData(data).should.equal('objectNumber=2016.1.1&description=A+museum+object');
    });

    it('should encode non-ascii characters', () => {
      const data = {
        objectNumber: '2016.1.1',
        description: 'åéîøü',
      };

      agent.getFormData(data).should.equal('objectNumber=2016.1.1&description=%C3%A5%C3%A9%C3%AE%C3%B8%C3%BC');
    });
    
    it('should encode puctuation', () => {
      const data = {
        objectNumber: '2016.1.1',
        description: 'this & that = "something"',
      };

      agent.getFormData(data).should.equal('objectNumber=2016.1.1&description=this+%26+that+%3D+%22something%22');
    });
  });

  describe('getData()', () => {
    const config = {
      data: {
        objectNumber: '2016.1.1',
        description: 'A museum object',
      },
    };

    it('should return the data if type is not form', () => {
      agent.getData(config).should.deep.equal(config.data);
    });
    
    it('should return a url-encoded parameter string if type is form', () => {
      const formConfig = Object.assign({}, config, {
        type: 'application/x-www-form-urlencoded',
      });
      
      agent.getData(formConfig).should.equal('objectNumber=2016.1.1&description=A+museum+object');
    });
  });

  describe('getAuth()', () => {
    it('should return null if a token is present', () => {
      const config = {
        username: 'user@collectionspace.org',
        password: 'secret',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      };

      expect(agent.getAuth(config)).to.be.a('null');
    });

    it('should return the username and password if the token is empty', () => {
      const config = {
        username: 'user@collectionspace.org',
        password: 'secret',
        token: '',
      };

      agent.getAuth(config).should.deep.equal({
        username: config.username,
        password: config.password,
      });
    });

    it('should return the username and password if the token is null', () => {
      const config = {
        username: 'user@collectionspace.org',
        password: 'secret',
        token: null,
      };

      agent.getAuth(config).should.deep.equal({
        username: config.username,
        password: config.password,
      });
    });

    it('should return the username and password if the token is undefined', () => {
      const config = {
        username: 'user@collectionspace.org',
        password: 'secret',
        token: undefined,
      };

      agent.getAuth(config).should.deep.equal({
        username: config.username,
        password: config.password,
      });
    });

    it('should return the username and password if no token is present', () => {
      const config = {
        username: 'user@collectionspace.org',
        password: 'secret',
      };

      agent.getAuth(config).should.deep.equal({
        username: config.username,
        password: config.password,
      });
    });
  });

  describe('getConfig()', () => {
    it('should convert the config to an axios config', () => {
      const config = {
        operation: 'read',
        resource: 'collectionobjects/2a4ac4bb-9e44-47ae-942e',
        location: 'http://demo.collectionspace.org/cspace-services',
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
      axiosConfig.should.have.property('url').that.equals(agent.getUrl(config));
      axiosConfig.should.have.property('method').that.equals(agent.getMethod(config));
      axiosConfig.should.have.property('baseURL').that.equals(agent.getBaseUrl(config));
      axiosConfig.should.have.property('headers').that.deep.equals(agent.getHeaders(config));
      axiosConfig.should.have.property('params').that.deep.equals(agent.getParams(config));
      axiosConfig.should.have.property('data').that.deep.equals(agent.getData(config));
      axiosConfig.should.have.property('auth').that.deep.equals(agent.getAuth(config));
    });
  });
});
