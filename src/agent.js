import axios from 'axios';
import config from './config';

function createResponse(axiosResponse) {
  if (typeof axiosResponse !== 'object') {
    return axiosResponse;
  }

  return {
    status: axiosResponse.status,
    statusText: axiosResponse.statusText,
    headers: axiosResponse.headers,
    data: axiosResponse.data,
  };
}

function createError(axiosError) {
  return {
    name: axiosError.name,
    code: axiosError.code,
    message: axiosError.message,
    response: createResponse(axiosError.response),
  };
}

axios.interceptors.response.use(
  response => createResponse(response),
  error => Promise.reject(createError(error))
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
