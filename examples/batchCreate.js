/**
 * Create object records with a range of object numbers.
 */

import cspace from '../src';
import log from './helpers/log';
import objectNumbers from './helpers/objectNumberGenerator';

const cs = cspace({
  url: 'http://nightly.collectionspace.org:8180/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

// Create all of the records in parallel. This may overload the CollectionSpace server for a
// large object number range. In the real world, limit the number of simultaneous creates.

Promise.all(
  Array.from(objectNumbers('TEST-', 100, 200), objectNumber =>
    cs.create('collectionobjects', {
      data: {
        document: {
          '@name': 'collectionobjects',
          'ns2:collectionobjects_common': {
            '@xmlns:ns2': 'http://collectionspace.org/services/collectionobject',
            objectNumber,
          },
        },
      },
    })
    .then(() => log(`Created ${objectNumber}`))
    .catch(() => log(`Error creating ${objectNumber}`))
  )
)
.then(() => log('Done'));
