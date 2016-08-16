import agent from './agent';
import config from './config';

function instance(cspaceConfig) {
  const sendRequest = (requestConfig) =>
    agent.sendRequest(config.merge(cspaceConfig, requestConfig));

  const sendRequestWithOperation = (operation) => (resource, requestConfig) =>
    sendRequest(config.merge(requestConfig, {
      resource,
      operation,
    }));

  return {
    create: sendRequestWithOperation('create'),
    read: sendRequestWithOperation('read'),
    update: sendRequestWithOperation('update'),
    delete: sendRequestWithOperation('delete'),
  };
}

export default {
  instance,
};
