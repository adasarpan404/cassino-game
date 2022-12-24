/** importing from node */
import jwt from "jsonwebtoken";
import { promisify } from "util";

/**importing from model */
import UserModel from "../model/user.model";

/**importing from common */
import CatchAsync from "../common/CatchAsync";
import AppError from "../common/AppError";

/**end of imports */

/**@desc for creating the JWT Token */
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

/**
 * @param user(Object)
 * @param statusCode(Number)
 * @param res(Object) it is being used for sending the response
 * @desc it is being used for sending response after successfull login and signup for signup.
 * It creates token for authentication for the user
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user
    }
  });
};

/**@desc for doing the signup*/
export const signUp = CatchAsync(async (req, res, next) => {
  const userObj = await UserModel.create({
    name: req.body.name,
    phonenumber: req.body.phonenumber,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  createSendToken(userObj, 201, res);
});

/**@desc for doing the login  */
export const login = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }
  const userObj = await UserModel.findOne({ email }).select("+password");
  if (!userObj || !(await userObj.correctPassword(password, user.password))) {
    return next(new AppError("incorrect email and password", 401));
  }
  createSendToken(user, 200, res);
});

/**@desc for authenticating the routes */
export const protect = CatchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please login in to get access", 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await UserModel.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The User belonging to this token does not longer exist",
        401
      )
    );
  }
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed Password! please login again", 401)
    );
  }
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

/**@desc for restricting the routes to the admin */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
