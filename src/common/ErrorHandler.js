import AppError from "./AppError.js";
import { MobileErr, MobileRes } from "./MobileApiRes.js";
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

/** @description handling if the user enters the duplicate data */
const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/([""])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field: ${value}. Please use another value`;
  return new AppError(message, 400);
};

/** @description it is used to handle the validation error like email */
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

/** @description it will be used to handle wrong jwt token error */
const handleJWTError = () => {
  new AppError("Invalid token. Please login again!", 401);
};

/** @description it will be used to handle expired token error */
const handleJWTExpiredError = () => {
  new AppError(" your token has expired! please log in again", 401);
};

/** @description it will be used to send error */
const sendError = (err, req, res) => {
  if (err.json) {
    res.status(err.statusCode).json(
      new MobileErr(
        err.message,
        "toast",
        {
          error: err.message
        },
        req.baseHeaders
      )
    );
  } else {
    if (err.isOperational) {
      res.status(200).render("base", {
        title: "something went wrong",
        purpose: err.message
      });

      // Programming or other unknown error: don't leak error details
    } else {
      console.error("ERROR 💥", err);
      res.status(500).json(
        new MobileErr(
          err.message,
          "toast",
          {
            error: err.message
          },
          req.baseHeaders
        )
      );
    }
  }
};

/**@description controlling the error response */
export default function ErrorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  error.message = err.message;
  if (error.name === "cast error") {
    error = handleCastErrorDB(error);
  }
  if (error.code === 11000) {
    error = handleDuplicateFieldsDB(error);
  }
  if (error.name === "ValidationError") {
    error = handleValidationErrorDB(error);
  }
  if (error.name === "JsonWebTokenError") {
    error = handleJWTError();
  }
  if (error.name === "TokenExpiredError") {
    error = handleJWTExpiredError();
  }

  sendError(error, req, res);
}
