// Copyright (c) 2015-2017 David M. Lee, II
'use strict';

/**
 * Exception indicating that the timeout expired.
 */
class TimeoutError extends Error {
  constructor(timeoutMillis) {
    super(`Promise did not resolve within ${timeoutMillis}ms`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.TimeoutError = TimeoutError;

/**
 * Rejects a promise with a {@link TimeoutError} if it does not settle within
 * the specified timeout.
 *
 * @param {Promise} promise The promise.
 * @param {number} timeoutMillis Number of milliseconds to wait on settling.
 * @returns {Promise} Either resolves/rejects with `promise`, or rejects with
 *                   `TimeoutError`, whichever settles first.
 */
function timeout(promise, timeoutMillis) {
  let timeoutId;
  const error = new TimeoutError(timeoutMillis);

  return Promise.race([
    promise,
    new Promise(function(resolve, reject) {
      timeoutId = setTimeout(function() {
        reject(error);
      }, timeoutMillis);
    }),
  ]).then(function(v) {
    clearTimeout(timeoutId);
    return v;
  }, function(err) {
    clearTimeout(timeoutId);
    throw err;
  });
}
exports.timeout = timeout;
