// importing from node
import jwt from "jsonwebtoken";
import { promisify } from "util";

// importing from model
import UserModel from "../model/user.model.js";

// importing from common
import CatchAsync from "../common/CatchAsync.js";
import AppError from "../common/AppError.js";

// importing from config
import { config } from "../config/config.js";
import { MobileRes } from "../common/MobileApiRes.js";

// end of imports

/**
 *
 * @param {*} id id of the user
 * @returns
 */
const signToken = id => {
  return jwt.sign({ id }, config.JWT.secret, {
    expiresIn: config.JWT.expiresIn
  });
};

/**
 * @param user(Object)
 * @param statusCode(Number)
 * @param res(Object) it is being used for sending the response
 * @param message (String)
 * @param header (Object)
 * @desc it is being used for sending response after successfull login and signup for signup.
 * It creates token for authentication for the user
 */
const createSendToken = (user, statusCode, res, message, headers) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + config.JWT.cookieExpiresIn * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  const data = {
    ...user.toObject(),
    token
  };

  res.status(statusCode).json(new MobileRes(message, data, headers));
};

/**@desc for doing the signup*/
export const signUp = CatchAsync(async (req, res, next) => {
  const userObj = await UserModel.create({
    name: req.body.name,
    phonenumber: req.body.phonenumber,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  createSendToken(userObj, 201, res, "Sign up successfully", req.baseHeaders);
});

/**@desc for doing the login  */
export const login = CatchAsync(async (req, res, next) => {
  const { phonenumber, password } = req.body;
  if (!phonenumber || !password) {
    return next(new AppError("please provide email and password", 400, true));
  }
  const userObj = await UserModel.findOne({ phonenumber }).select("+password");
  if (
    !userObj ||
    !(await userObj.correctPassword(password, userObj.password))
  ) {
    return next(new AppError("incorrect email and password", 401, true));
  }
  createSendToken(userObj, 200, res, "login successfull", req.baseHeaders);
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
  const decoded = await promisify(jwt.verify)(token, config.JWT.secret);
  const currentUser = await UserModel.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The User belonging to this token does not longer exist",
        401,
        false
      )
    );
  }
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User recently changed Password! please login again",
        401,
        true
      )
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
        new AppError(
          "You do not have permission to perform this action",
          403,
          false
        )
      );
    }
    next();
  };
};

/**@desc logging out the user */
export const logout = CatchAsync(async (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: "success" });
});
