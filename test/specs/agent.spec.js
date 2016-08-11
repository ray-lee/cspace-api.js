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

      agent.getHeaders(config).should.deep.equal({
        Authorization: `Bearer ${config.token}`,
      });
    });

    it('should return null if the token is empty', () => {
      const config = {
        token: '',
      };

      expect(agent.getHeaders(config)).to.be.a('null');
    });

    it('should return null if the token is null', () => {
      const config = {
        token: null,
      };

      expect(agent.getHeaders(config)).to.be.a('null');
    });

    it('should return null if the token is undefined', () => {
      const config = {
        token: undefined,
      };

      expect(agent.getHeaders(config)).to.be.a('null');
    });

    it('should return null if no token is present', () => {
      const config = {};

      expect(agent.getHeaders(config)).to.be.a('null');
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

  describe('getData()', () => {
    it('should return the content', () => {
      const config = {
        content: {
          objectNumber: '2016.1.1',
          description: 'A museum object',
        },
      };

      agent.getData(config).should.deep.equal(config.content);
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
