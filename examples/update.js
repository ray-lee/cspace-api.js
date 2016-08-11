import util from 'util';
import cspace from '../src/cspace';

const localhost = cspace.instance({
  url: 'http://localhost:8180/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

localhost.update('collectionobjects/0a5f1405-60e2-417b-82fc',
  {
    content: {
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
