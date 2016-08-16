import cspace from '../src';
import log from './helpers/log';

const cs = cspace({
  url: 'http://nightly.collectionspace.org:8180/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

const config = {
  params: {
    pgSz: 5,
    pgNum: 0,
    as: 'collectionobjects_common:objectNumber ILIKE "%TEST.1470878696917%"',
    wf_deleted: false,
  },
};

cs.read('collectionobjects', config)
  .then(response => log(response))
  .catch(error => log(error));
