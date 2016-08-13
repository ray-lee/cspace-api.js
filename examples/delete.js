import util from 'util';
import cspace from '../src/cspace';

const cs = cspace.instance({
  url: 'http://nightly.collectionspace.org:8180/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

cs.delete('collectionobjects/7fed15cc-dfa7-477c-90e2')
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
