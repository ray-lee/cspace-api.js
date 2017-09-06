/* global File */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import cspace from '../../src/cspace';

chai.use(chaiAsPromised);
chai.should();

const instanceConfig = {
  url: 'http://nightly.collectionspace.org:8180/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
};

describe(`file upload to ${instanceConfig.url}`, function suite() {
  this.timeout(20000);

  const inNode = (typeof window === 'undefined');
  const cs = cspace(instanceConfig);

  context('in node', () => {
    it('can create a blob from a Stream', function test() {
      if (!inNode) {
        this.skip();
      }

      /* eslint-disable global-require */
      const fs = require('fs');
      const path = require('path');
      /* eslint-enable global-require */

      const stream = fs.createReadStream(path.resolve(__dirname, '../assets/collectionspace.png'));

      const config = {
        type: 'multipart/form-data',
        data: {
          file: stream,
        },
      };

      return cs.create('blobs', config).should.eventually
        .include({ status: 201 })
        .and.have.nested.property('headers.location').that.is.ok;
    });

    it('can create a blob from a Buffer', function test() {
      if (!inNode) {
        this.skip();
      }

      /* eslint-disable global-require */
      const fs = require('fs');
      const path = require('path');
      /* eslint-enable global-require */

      const buffer = fs.readFileSync(path.resolve(__dirname, '../assets/collectionspace.png'));

      const config = {
        type: 'multipart/form-data',
        data: {
          file: buffer,
        },
      };

      return cs.create('blobs', config).should.eventually
        .include({ status: 201 })
        .and.have.nested.property('headers.location').that.is.ok;
    });
  });

  context('in a browser', () => {
    it('can create a blob from a File', function test() {
      if (inNode) {
        this.skip();
      }

      let file;

      try {
        file = new File([new Uint8Array(16)], 'test');
      } catch (err) {
        if (err.name === 'TypeError' && err.number === -2146823286) {
          // Edge does not yet support the File constructor. Just skip the test.
          this.skip();
        } else {
          throw err;
        }
      }

      const config = {
        type: 'multipart/form-data',
        data: {
          file,
        },
      };

      return cs.create('blobs', config).should.eventually
        .include({ status: 201 })
        .and.have.nested.property('headers.location').that.is.ok;
    });

    // it('can create a blob from a File', function test() {
    //   if (inNode) {
    //     this.skip();
    //   }

    //   const input = document.createElement('input');
    //   input.type = 'file';

    //   document.body.appendChild(input);

    //   input.onchange = (event) => {
    //     const file = event.target.files[0];

    //     const config = {
    //       type: 'multipart/form-data',
    //       data: {
    //         file,
    //       },
    //     };

    //     cs.create('blobs', config);
    //   };
    // });
  });
});
