import cspace from '../src/cspace';
import log from './helpers/log';

const cs = cspace.instance({
  url: 'http://nightly.collectionspace.org:8180/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

cs.delete('collectionobjects/137eacd9-3e17-4c9f-9aec')
  .then(response => log(response))
  .catch(error => log(error));
