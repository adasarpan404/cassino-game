/**importing from node*/

import Joi from "joi";
import path from "path";
import _ from "lodash";

/**end of imports */

let /**@desc path for environment variable files */
  envPath = path.resolve(process.cwd(), ".env");

require("dotenv").config({ path: envPath });

const /**@desc validation for env files*/
  envVarsSchema = Joi.object({
    PORT: Joi.number().default(4103),
    MONGO_URI: Joi.string()
      .required()
      .description("Mongo uri")
  })
    .unknown()
    .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  console.log("\n envVars", envVars);
  throw new Error(`Config validation error: ${error.message}`);
}

export const /**@desc will be used in our source files*/
  config = {
    PORT: envVars.PORT,
    MONGO_URI: envVars.MONGO_URI
  };
