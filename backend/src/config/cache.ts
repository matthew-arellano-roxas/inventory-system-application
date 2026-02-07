import NodeCache from 'node-cache';

const cache = new NodeCache({
  stdTTL: 60, // default time-to-live (seconds) for all keys
  checkperiod: 120, // how often expired keys are deleted (seconds)
  useClones: true, // whether to return a clone of the cached value (safer)
  deleteOnExpire: true, // automatically delete expired keys
});

export { cache };
