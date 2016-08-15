import cspace from '../src/cspace';
import log from './helpers/log';

const cs = cspace.instance({
  url: 'http://nightly.collectionspace.org:8180/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

cs.read('collectionobjects/62eba826-cb66-4462-b16e')
  .then(response => log(response))
  .catch(error => log(error));
