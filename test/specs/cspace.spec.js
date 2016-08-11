import chai from 'chai';
import cspace from '../../src/cspace';

chai.should();

describe('cspace', () => {
  describe('instance()', () => {
    it('should return a new cspace instance', () => {
      cspace.instance().should.be.an('object')
        .that.includes.keys('create', 'read', 'update', 'delete');
    });
  });
});
