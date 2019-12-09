/**
 * Retrieve a new access token using a username and password.
 */

import cspace from '../src';
import log from './helpers/log';

const csAuth = cspace({
  url: 'http://localhost:8180/cspace-services/oauth',
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
  .then(response => log('response', response))
  .catch(error => log('error', error));
