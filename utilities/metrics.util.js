const SDC = require('statsd-client');
const config = require('../config');
const logger = require('../logs/winston');
const sdc = new SDC({
    host: config.statsdConfig.host,
    port: config.statsdConfig.port,
    debug: config.statsdConfig.debug
});

const invoke = (methodName, key, ...params) => {
    key = [config.statsdConfig.metricsService, key].join('.');
    sdc[methodName].apply(sdc, [key, ...params]);
}

const close = () => {
    logger.info("Closing statsd-client connection");
    sdc.close();
    logger.info("Closed statsd-client connection");
}

module.exports = {
    invoke,
    close
}