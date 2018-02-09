/* global FormData */

import axios from 'axios';
import NodeFormData from 'form-data';
import URLSearchParams from 'url-search-params';
import config from './config';

const MIME_TYPE_FORM = 'application/x-www-form-urlencoded';
const MIME_TYPE_JSON = 'application/json';
const MIME_TYPE_MULTIPART_FORM_DATA = 'multipart/form-data';

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

function toFormData(data) {
  const params = new URLSearchParams();

  if (data) {
    Object.entries(data)
      // eslint-disable-next-line no-unused-vars
      .filter(([key, value]) => (value !== null && typeof value !== 'undefined'))
      .forEach(([key, value]) => params.set(key, value));
  }

  return params.toString();
}

function toMultipartFormData(data) {
  const formData = (typeof FormData !== 'undefined') ? new FormData() : new NodeFormData();

  if (data) {
    Object.entries(data)
      // eslint-disable-next-line no-unused-vars
      .filter(([key, value]) => (value !== null && typeof value !== 'undefined'))
      .forEach(([key, value]) => formData.append(key, value));
  }

  return formData;
}

function getConfig(requestConfig) {
  const url = requestConfig.resource;
  const method = methods[requestConfig.operation];
  const baseURL = requestConfig.url;
  const params = requestConfig.params;
  const responseType = requestConfig.responseType;

  let data = null;

  if (requestConfig.type === MIME_TYPE_FORM) {
    data = toFormData(requestConfig.data);
  } else if (requestConfig.type === MIME_TYPE_MULTIPART_FORM_DATA) {
    data = toMultipartFormData(requestConfig.data);
  } else {
    data = requestConfig.data;
  }

  const headers = {};

  let auth = null;

  if (config.hasOption(requestConfig, 'token')) {
    headers.Authorization = `Bearer ${requestConfig.token}`;
  } else if (requestConfig.username || requestConfig.password) {
    auth = {
      username: requestConfig.username,
      password: requestConfig.password,
    };
  }

  if (config.hasOption(requestConfig, 'type')) {
    const type = requestConfig.type;

    if (type === MIME_TYPE_FORM || type === MIME_TYPE_JSON) {
      headers['Content-Type'] = `${type};charset=utf-8`;
    } else if (type === MIME_TYPE_MULTIPART_FORM_DATA) {
      if (data && data.getHeaders) {
        // If we're in node, using form-data, axios won't natively know what to do (it just sees a
        // stream). We need to manually set the content type header to have the correct mime type
        // and boundary, using the getHeaders method. If we're in a browser, using the built-in
        // FormData, the header will be set automatically, so we don't have to do anything.
        headers['Content-Type'] = data.getHeaders()['content-type'];
      }
    } else {
      headers['Content-Type'] = type;
    }
  }

  return {
    url,
    method,
    baseURL,
    headers,
    params,
    data,
    auth,
    responseType,
  };
}

function sendRequest(requestConfig) {
  return axios(getConfig(requestConfig));
}

export default {
  getConfig,
  sendRequest,
};
