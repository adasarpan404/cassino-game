/**@desc throwing error */
export default class AppError extends Error {
  constructor(message, statusCode, json) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.json = json;

    Error.captureStackTrace(this, this.constructor);
  }
}
