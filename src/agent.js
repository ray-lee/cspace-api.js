import axios from 'axios';
import URLSearchParams from 'url-search-params';
import config from './config';

const mimeType = {
  form: 'application/x-www-form-urlencoded',
  json: 'application/json',
};

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
  const headers = {};

  if (config.hasOption(requestConfig, 'type')) {
    let type = requestConfig.type;
    
    if (type === mimeType.form || type === mimeType.json) {
      type = `${type};charset=utf-8`;
    }

    headers['Content-Type'] = type;
  }

  if (config.hasOption(requestConfig, 'token')) {
    headers.Authorization = `Bearer ${requestConfig.token}`;
  }

  return headers;
}

function getParams(requestConfig) {
  return requestConfig.params;
}

function getFormData(data) {
  const params = new URLSearchParams();

  Object.keys(data).forEach(key => params.set(key, data[key]));

  return params.toString();
}

function getData(requestConfig) {
  if (requestConfig.type === mimeType.form) {
    return getFormData(requestConfig.data);
  }

  return requestConfig.data;
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
  getFormData,
  getData,
  getAuth,
  getConfig,
  sendRequest,
};
