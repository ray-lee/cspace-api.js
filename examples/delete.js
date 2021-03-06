/**
 * Delete an object record by CSID.
 */

import cspace from '../src';
import log from './helpers/log';

const cs = cspace({
  url: 'https://core.dev.collectionspace.org/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

cs.delete('collectionobjects/137eacd9-3e17-4c9f-9aec')
  .then((response) => log('response', response))
  .catch((error) => log('error', error));
