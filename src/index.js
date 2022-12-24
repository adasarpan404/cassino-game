/**importing from node */
import mongoose from "mongoose";

/** importing from config */
import { config } from "../config/config.js";

/** importing from app */
import app from "./app.js";

/** end of imports */
process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose
  .connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB connection successful!"));

const /**@desc specifying the port for server */
  port = config.PORT || 3000;

const /**@desc starting the server */
  server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });

process.on("unhandledRejection", err => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});
