/**
 * List object records.
 */

import cspace from '../src';
import log from './helpers/log';

const cs = cspace({
  url: 'https://core.dev.collectionspace.org/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

const config = {
  params: {
    pgSz: 5,
    pgNum: 0,
  },
};

cs.read('collectionobjects', config)
  .then((response) => log('response', response))
  .catch((error) => log('error', error));
