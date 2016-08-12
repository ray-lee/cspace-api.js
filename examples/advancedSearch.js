import util from 'util';
import cspace from '../src/cspace';

const cs = cspace.instance({
  url: 'http://localhost:8180/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

cs.read('collectionobjects',
  {
    params: {
      pgSz: 5,
      pgNum: 0,
      as: 'collectionobjects_common:objectNumber ILIKE "%TEST.1470878696917%"',
      wf_deleted: false,
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

