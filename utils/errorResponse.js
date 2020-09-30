class ErrorResponse extends Error {
  constructor(message, errorStatus) {
    super(message);
    this.statusCode = errorStatus;
  }
}

module.exports = ErrorResponse;
