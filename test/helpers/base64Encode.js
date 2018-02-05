/* global btoa */

export default (value) => {
  if (typeof value === 'undefined' || value === null) {
    return value;
  }

  if (typeof btoa !== 'undefined') {
    return btoa(value);
  }

  return new Buffer(value).toString('base64');
};
