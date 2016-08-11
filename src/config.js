import extend from 'extend';

function merge(...config) {
  return extend(true, {}, ...config);
}

function hasValue(value) {
  return (typeof value !== 'undefined' && value !== null && value !== '');
}

function hasOption(config, option) {
  return hasValue(config[option]);
}

export default {
  merge,
  hasOption,
};
