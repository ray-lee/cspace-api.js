import chai from 'chai';
import cspace from '../../src/cspace';

chai.should();

describe('cspace', () => {
  describe('cspace()', () => {
    it('should return a new cspace instance', () => {
      cspace().should.be.an('object')
        .that.includes.keys('create', 'read', 'update', 'delete');
    });
  });
});
