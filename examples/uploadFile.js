/**
 * Create a blob record with uploaded file data.
 */

import fs from 'fs';
import cspace from '../src';
import log from './helpers/log';

const cs = cspace({
  url: 'http://nightly.collectionspace.org:8180/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

const config = {
  contentType: 'multipart/form-data',
  data: {
    // 'file' is the name of the field, as specified in REST API docs.
    // In node, the value may be a Buffer or a Stream.
    // In browsers, the value may be a File.
    file: fs.createReadStream('./'),
  },
};

cs.create('blobs', config)
  .then(response => log('response', response))
  .catch(error => log('error', error));
