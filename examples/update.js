/**
 * Update an object record by CSID.
 */

import cspace from '../src';
import log from './helpers/log';

const cs = cspace({
  url: 'http://localhost:8180/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

const config = {
  data: {
    document: {
      '@name': 'collectionobjects',
      'ns2:collectionobjects_common': {
        '@xmlns:ns2': 'http://collectionspace.org/services/collectionobject',
        '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        comments: {
          comment: 'This is an updated comment',
        },
      },
    },
  },
};

cs.update('collectionobjects/62eba826-cb66-4462-b16e', config)
  .then(response => log('response', response))
  .catch(error => log('error', error));
