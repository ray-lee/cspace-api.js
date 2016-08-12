import util from 'util';
import cspace from '../src/cspace';

const cs = cspace.instance({
  url: 'http://localhost:8180/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

cs.create('collectionobjects',
  {
    content: {
      document: {
        '@name': 'collectionobjects',
        'ns2:collectionobjects_common': {
          '@xmlns:ns2': 'http://collectionspace.org/services/collectionobject',
          '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          objectNumber: `TEST.${Date.now()}`,
          comments: {
            comment: `Created by cspace-api.js ${(new Date()).toISOString()}`,
          },
        },
      },
    },
  })
  .then(response => {
    console.log(util.inspect(response, {
      depth: 6,
      colors: true,
    }));
  })
  .catch(error => {
    console.log(util.inspect(error, {
      depth: 6,
      colors: true,
    }));
  });
