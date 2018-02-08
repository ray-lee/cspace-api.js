import lodashMerge from 'lodash/merge';

function merge(...config) {
  // TODO: Consider not merging data, as this is potentially a large structure being copied.
  // Merging data allows some default data to be configured that is always sent, but is there an
  // actual use case for this?

  return lodashMerge({}, ...config);
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
