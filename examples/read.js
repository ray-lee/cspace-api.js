/**
 * Retrieve an object record by CSID.
 */

import cspace from '../src';
import log from './helpers/log';

const cs = cspace({
  url: 'http://localhost:8180/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

cs.read('collectionobjects/62eba826-cb66-4462-b16e')
  .then(response => log('response', response))
  .catch(error => log('error', error));
