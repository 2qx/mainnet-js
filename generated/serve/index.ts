 /*
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
require("dotenv").config({ path: ".env.regtest" });

import { ExpressServer } from "./expressServer";
import { logger } from "./logger";
import { config } from "./config";

let expressServer: any;

const launchServer = async () => {
  try {
    expressServer = new ExpressServer(config.URL_PORT, config.OPENAPI_YAML);
    expressServer.launch();
    logger.info("Express server running");
  } catch (error) {
    logger.error("Express Server failure", error.message);
    await expressServer.close();
  }
};

export const getServer = () => {
  expressServer = new ExpressServer(config.URL_PORT, config.OPENAPI_YAML);
  return expressServer
}

export function startServer(){
  launchServer().catch(e => logger.error(e));
}
