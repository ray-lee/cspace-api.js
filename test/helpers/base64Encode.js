/* global window */

export default (value) => {
  if (typeof value === 'undefined' || value === null) {
    return value;
  }

  if (typeof window !== 'undefined') {
    return window.btoa(value);
  }

  return Buffer.from(value).toString('base64');
};
