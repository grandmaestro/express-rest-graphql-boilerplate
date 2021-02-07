const mysql = require('mysql'),
    logger = require('../logs/winston'),
    config = require('../config'),
    metrics = require('../utilities/metrics.util'),
    messages = require('../com/constants/messages');

var sqlDbPoolCluster = null;

//SQL
const poolCluster = (callback) => {
    sqlDbPoolCluster = mysql.createPoolCluster({
        //config if need
    });
    if (sqlDbPoolCluster == null)
        callback(true); //unable to create the cluster
    else
        callback();
}

const createCluster = () => {
    return new Promise((resolve, reject) => {
        poolCluster((err) => {
            if (err) {
                metrics.invoke('increment', messages.statsd.db.createClusterError);
                logger.error(messages.error.db.createClusterConnection);
                reject(err);
            } else {
                logger.info(messages.info.db.createClusterConnection);
                sqlDbPoolCluster.add(config.sqlDBConfig.master.name, config.sqlDBConfig.master);
                sqlDbPoolCluster.add(config.sqlDBConfig.replica_A.name, config.sqlDBConfig.replica_A);
                resolve();
            }
        });
    })
}

const closePoolCluster = () => {
    sqlDbPoolCluster.end(function (err) {
        if (err) {
            metrics.invoke('increment', messages.statsd.db.closeClusterError);
            logger.error("Error:", err);
        } else {
            // all connections in the pool have ended
            logger.info(messages.info.db.closeClusterConnection);
        }
    });
}

// Reason for separate function is we want to handle logging and metric separately
const connectQuery = async (query, params, poolGroup) => {
    return new Promise((resolve, reject) => {

        if (!query) {
            logger.error(messages.error.db.emptyQuery);
            return reject(new Error(messages.error.internal));
        }
        poolGroup = poolGroup || config.sqlDBConfig.replica_A.name;

        sqlDbPoolCluster.getConnection(poolGroup, function (err, connection) {
            if (err) {
                metrics.invoke('increment', messages.statsd.db.getConnectionError);
                logger.error(messages.error.db.getConnection, err);
                return reject(new Error(messages.error.internal));
            }

            // logger.info(messages.info.db.getConnection);

            executeQuery(query, params, connection)
                .then(result => {
                    return resolve(result)
                })
                .catch(error => reject(error));
        });
    });
}

const executeQuery = (query, params, connection) => {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
            // Release connection back to pool no matter execution success or failure
            connection.release();
            if (err) {
                metrics.invoke('increment', messages.statsd.db.execQueryError);
                logger.error(`${messages.error.db.execQuery} ${err.message}`);
                return reject(err);
            }
            resolve(result);
        })
    })
}

const queryReplica = (query, params) => {
    return new Promise(async (resolve, reject) => {
        if (!query) {
            logger.error(messages.error.db.emptyQuery);
            return reject(new Error(messages.error.internal));
        }
        const poolGroup = config.sqlDBConfig.replica_A.name;
        try {
            const result = await connectQuery(query, params, poolGroup);
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

const queryMaster = async (query, params, options = { attemptRetry: false }) => {
    if (!query) {
        logger.error(messages.error.db.emptyQuery);
        throw new Error(messages.error.internal);
    }
    let retryAttempt = 1;
    if (options.attemptRetry) {
        retryAttempt = config.sqlDBConfig.master.retryCount;
    }
    const poolGroup = config.sqlDBConfig.master.name;
    for (let i = 0; i < retryAttempt; i++) {
        try {
            return await connectQuery(query, params, poolGroup);
        } catch (err) {
            if (!!err && !!err.code && err.code === "ER_LOCK_DEADLOCK") {
                if (i === retryAttempt - 1) {
                    logger.error(messages.error.db.maxRetryQueryDone + err);
                } else {
                    logger.debug(messages.debug.db.retryDeadlock + query);
                    continue;
                }
            }
            metrics.invoke('increment', messages.statsd.db.execQueryError);
            throw err;
        }
    }
}


const startTx = async () => {
    await queryMaster('START TRANSACTION;');
}

const commitTx = async () => {
    await queryMaster('COMMIT;');
}

const rollbackTx = async () => {
    await queryMaster('ROLLBACK;');
}

// Create SQL Connection Pool
createCluster()
    .catch(() => {
        process.kill(process.pid);
    });


module.exports = {
    sqlDbPoolCluster,
    queryMaster,
    queryReplica,
    closePoolCluster,
    startTx,
    commitTx,
    rollbackTx
}