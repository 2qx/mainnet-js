const config = require('./config');
const logger = require('./logger');
const ExpressServer = require('./expressServer');

const launchServer = async () => {
  try {
    this.expressServer = new ExpressServer(config.URL_PORT, config.OPENAPI_YAML, config.DOC_YAML);
    this.expressServer.launch();
    logger.info('Express server running');
  } catch (error) {
    logger.error('Express Server failure', error.message);
    await this.close();
  }
};

const getServer = () => {
  expressServer = new ExpressServer(config.URL_PORT, config.OPENAPI_YAML, config.DOC_YAML);
  return expressServer
}


function startServer() {
  launchServer().catch(e => logger_1.logger.error(e));
}

module.exports = { startServer , getServer };