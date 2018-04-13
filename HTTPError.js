'use strict';

module.exports = class HTTPError extends Error {
  constructor(status, message) {
    super(message);
   // Error.captureStackTrace(this, HTTPError);
    this.status = status;
    this.message = message;
  }
};


// module.exports = function CustomHTTPError(status, message) {
//   Error.captureStackTrace(this, this.constructor);
//   this.name = this.constructor.name;
//   this.status = status;
//   this.message = message;
// };

require('util').inherits(module.exports, Error);
