import cspace from '../src/cspace';
import log from './helpers/log';

const cs = cspace.instance({
  url: 'http://nightly.collectionspace.org:8180/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

const config = {
  params: {
    pgSz: 5,
    pgNum: 0,
    kw: 'test',
    wf_deleted: false,
  },
};

cs.read('collectionobjects', config)
  .then(response => log(response))
  .catch(error => log(error));
