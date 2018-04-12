module.exports = class HTTPError extends Error {
  constructor(status, message) {
    super(message);
    Error.captureStackTrace(this. HTTPError);
    // this.name = this.constructor.name;
    // if (typeof Errror.)
    this.status = status;

    this.message = message;
  } 
};
