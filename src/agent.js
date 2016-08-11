import axios from 'axios';
import config from './config';

function normalizedResponse(response) {
  if (typeof response !== 'object') {
    return response;
  }

  const normalized = {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    data: response.data,
  };

  return normalized;
}

function normalizedError(error) {
  if ('config' in error || 'response' in error) {
    const normalized = new Error();

    Object.assign(normalized, error);

    if ('config' in normalized) {
      delete normalized.config;
    }

    if ('response' in error) {
      normalized.response = normalizedResponse(error.response);

      if (typeof normalized.response === 'undefined') {
        delete normalized.response;
      }
    }

    return normalized;
  }

  return error;
}

axios.interceptors.response.use(
  response => normalizedResponse(response),
  error => Promise.reject(normalizedError(error))
);

const methods = {
  create: 'POST',
  read: 'GET',
  update: 'PUT',
  delete: 'DELETE',
};

function getUrl(requestConfig) {
  return requestConfig.resource;
}

function getMethod(requestConfig) {
  return methods[requestConfig.operation];
}

function getBaseUrl(requestConfig) {
  return requestConfig.url;
}

function getHeaders(requestConfig) {
  if (!config.hasOption(requestConfig, 'token')) {
    return null;
  }

  return {
    Authorization: `Bearer ${requestConfig.token}`,
  };
}

function getParams(requestConfig) {
  return requestConfig.params;
}

function getData(requestConfig) {
  return requestConfig.content;
}

function getAuth(requestConfig) {
  if (config.hasOption(requestConfig, 'token')) {
    return null;
  }

  return {
    username: requestConfig.username,
    password: requestConfig.password,
  };
}

function getConfig(requestConfig) {
  return {
    url: getUrl(requestConfig),
    method: getMethod(requestConfig),
    baseURL: getBaseUrl(requestConfig),
    headers: getHeaders(requestConfig),
    params: getParams(requestConfig),
    data: getData(requestConfig),
    auth: getAuth(requestConfig),
  };
}

function sendRequest(requestConfig) {
  return axios(getConfig(requestConfig));
}

export default {
  getUrl,
  getMethod,
  getBaseUrl,
  getHeaders,
  getParams,
  getData,
  getAuth,
  getConfig,
  sendRequest,
};
