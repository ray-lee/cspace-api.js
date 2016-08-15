import chai from 'chai';
import deepFreeze from 'deep-freeze-strict';
import config from '../../src/config';

chai.should();

describe('config', () => {
  describe('merge()', () => {
    it('should not mutate passed configuration objects', () => {
      const cfg1 = {
        operation: 'read',
      };

      const cfg2 = {
        operation: 'delete',
      };

      deepFreeze(cfg1);
      deepFreeze(cfg2);

      config.merge(cfg1, cfg2)
        .should.be.an('object')
        .should.not.equal(cfg1)
        .should.not.equal(cfg2);
    });

    it('should override configuration options from left to right', () => {
      const cfg1 = {
        operation: 'read',
        pgSz: 100,
        pgNum: 0,
      };

      const cfg2 = {
        operation: 'delete',
        pgSz: 50,
      };

      const cfg3 = {
        operation: 'create',
      };

      config.merge(cfg1, cfg2, cfg3).should.deep.equal({
        operation: 'create',
        pgSz: 50,
        pgNum: 0,
      });
    });

    // TODO: This would be nice, but neither extend nor deep-assign
    //       support overriding with undefined. (Object.assign does,
    //       but it is not deep.) In the meantime, overriding with
    //       null or empty string both have the effect of unsetting
    //       an option.
    //
    // it('should allow overriding values with undefined', () => {
    //   const cfg1 = {
    //     operation: 'read',
    //   };
    //
    //   const cfg2 = {
    //     operation: undefined,
    //   };
    //
    //   config.merge(cfg1, cfg2).should.deep.equal({
    //     operation: undefined,
    //   });
    // });

    it('should allow overriding values with null', () => {
      const cfg1 = {
        operation: 'read',
      };

      const cfg2 = {
        operation: null,
      };

      config.merge(cfg1, cfg2).should.deep.equal({
        operation: null,
      });
    });

    it('should allow overriding values with empty string', () => {
      const cfg1 = {
        operation: 'read',
      };

      const cfg2 = {
        operation: '',
      };

      config.merge(cfg1, cfg2).should.deep.equal({
        operation: '',
      });
    });

    it('should not copy deep objects unnecessarily', () => {
      const cfg1 = {
        operation: 'read',
        data: {},
      };

      const cfg2 = {
        data: {
          collectionobjects_common: {
            objectNumber: '1234',
            comments: {
              comment: [
                'comment 1',
                'comment 2',
                'comment 3',
              ],
            },
          },
        },
      };

      config.merge(cfg1, cfg2)
        .should.have.deep.property('data.collectionobjects_common')
          .that.equals(cfg2.data.collectionobjects_common);
    });
  });

  describe('hasOption()', () => {
    it('should return true if the option is a non-empty string', () => {
      const cfg = {
        operation: 'read',
      };

      config.hasOption(cfg, 'operation').should.equal(true);
    });

    it('should return true if the option is 0', () => {
      const cfg = {
        pgNum: 0,
      };

      config.hasOption(cfg, 'pgNum').should.equal(true);
    });


    it('should return true if the option is an empty object', () => {
      const cfg = {
        data: {},
      };

      config.hasOption(cfg, 'data').should.equal(true);
    });

    it('should return true if the option is an empty array', () => {
      const cfg = {
        data: [],
      };

      config.hasOption(cfg, 'data').should.equal(true);
    });

    it('should return false if the option is not present', () => {
      const cfg = {
        operation: 'read',
      };

      config.hasOption(cfg, 'location').should.equal(false);
    });

    it('should return false if the option is undefined', () => {
      const cfg = {
        operation: undefined,
      };

      config.hasOption(cfg, 'operation').should.equal(false);
    });

    it('should return false if the option is null', () => {
      const cfg = {
        operation: null,
      };

      config.hasOption(cfg, 'operation').should.equal(false);
    });

    it('should return false if the option is an empty string', () => {
      const cfg = {
        operation: '',
      };

      config.hasOption(cfg, 'operation').should.equal(false);
    });
  });
});
