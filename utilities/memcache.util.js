const NodeCache = require('node-cache');
const logger = require('../logs/winston');
const config = require('../config');

const cache = new NodeCache({
    stdTTL: config.nodeCacheConfig.recordTTL,
    checkperiod: config.nodeCacheConfig.checkPeriod
});

const insert = (namespace, key, value) => {
    const cacheKey = `${namespace}.${key}`;
    return new Promise((resolve, reject) => {
        value = JSON.stringify(value);
        if (!config.isDev) {
            cache.set(cacheKey, value, function (err, success) {
                if (err) {
                    logger.error(err);
                    return reject(err);
                } else {
                    return resolve(success);
                }
            })
        } else {
            return resolve();
        }
    });
}

const read = (namespace, key) => {
    const cacheKey = `${namespace}.${key}`;
    return new Promise((resolve, reject) => {
        try {
            cache.get(cacheKey, function (err, value) {
                if (err) {
                    logger.error(err);
                    return reject(err);
                } else {
                    if (!!value) {
                        value = JSON.parse(value);
                    }
                    return resolve(value);
                }
            })
        } catch (err) {
            logger.error(err);
            reject(err);
        }
    })
}

const readMany = (namespace, keys) => {
    return new Promise((resolve, reject) => {
        const cacheKeys = keys.map((key) => `${namespace}.${key}`);
        return cache.mget(cacheKeys, function (err, values) {
            if (err) {
                logger.error(err);
                return reject(err);
            } else {
                Object.keys(values).forEach((value) => {
                    values[value] = JSON.parse(values[value]);
                });
                return resolve(values);
            }
        })
    })
}

cache.on("set", function (key, value) {
    let stats = cache.getStats();
    let totalSize = stats.ksize + stats.vsize;
    if (totalSize >= 500000000) {
        cache.flushAll();
    }
})

const close = () => {
    cache.flushAll();
    cache.close();
    logger.info("Closed node cache");
}

module.exports = {
    insert,
    read,
    readMany,
    close
}