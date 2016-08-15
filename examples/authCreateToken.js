import cspace from '../src/cspace';
import log from './helpers/log';

const csAuth = cspace.instance({
  url: 'http://nightly.collectionspace.org:8180/cspace-services/oauth',
  username: 'cspace-ui',
  password: '',
  type: 'application/x-www-form-urlencoded',
});

const config = {
  data: {
    grant_type: 'password',
    username: 'admin@core.collectionspace.org',
    password: 'Administrator',
  },
};

csAuth.create('token', config)
  .then(response => log(response))
  .catch(error => log(error));
