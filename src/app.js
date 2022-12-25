// importing from node
import express from "express";
import morgan from "morgan";
import xss from "xss-clean";
import path from "path";
import cors from "cors";
import compression from "compression";
import mongoSantize from "express-mongo-sanitize";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// importing from common
import AppError from "./common/AppError.js";
import ErrorHandler from "./common/ErrorHandler.js";

// importing from router
import authRouter from "./routes/auth.routes.js";
import { attachBaseHeaders } from "./common/AttachBaseHeaders.js";

// end of imports

const app = express();

app.use(attachBaseHeaders);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(morgan("dev"));
app.use(helmet());
app.use(xss());
app.use(mongoSantize());
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());
app.use(compression());

// app.use('/', viewRouter)
app.use("/api/v1/auth", authRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(ErrorHandler);
module.exports = app;
