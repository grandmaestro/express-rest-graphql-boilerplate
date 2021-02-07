let config = {
    'isDev': process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "staging",
    'sso'  : {
        'userTokenDetail': process.env.SSO_USER_TOKEN_DETAIL,
        'serviceId'      : process.env.SSO_SERVICE_ID
    },
    'sqlDBConfig': {
        'master': {
            'host'           : process.env.MASTER_SQL_HOST,
            'user'           : process.env.MASTER_SQL_USERNAME,
            'password'       : process.env.MASTER_SQL_PASSWORD,
            'name'           : 'MASTER',
            'port'           : process.env.MASTER_SQL_PORT || 3306,                                           // SQL Default port
            'database'       : process.env.MASTER_SQL_DB,
            'connectionLimit': process.env.MASTER_SQL_CONNECTION_LIMIT || 10,                                 // SQL Default connection
            'acquireTimeout' : process.env.MASTER_SQL_CONNECTION_ACQUIRE_TIMEOUT_IN_MILLISECONDS || 100000,   // Set to default incase key does not exist
            'retryCount'     : parseInt(process.env.MASTER_RETRY_COUNT, 10)
        },
        'replica_A': {
            'host'           : process.env.REPLICA_A_SQL_HOST,
            'user'           : process.env.REPLICA_A_SQL_USERNAME,
            'password'       : process.env.REPLICA_A_SQL_PASSWORD,
            'name'           : 'REPLICA_A',
            'port'           : process.env.REPLICA_A_SQL_PORT || 3306,                                         // SQL Default port
            'database'       : process.env.REPLICA_A_SQL_DB,
            'connectionLimit': process.env.REPLICA_A_SQL_CONNECTION_LIMIT || 10,                               // SQL Default connection
            'acquireTimeout' : process.env.REPLICA_A_SQL_CONNECTION_ACQUIRE_TIMEOUT_IN_MILLISECONDS || 100000  // Set to default incase key does not exist
        }
    },

    'statsdConfig': {
        'host'          : process.env.STATSD_ENDPOINT,
        'port'          : process.env.STATSD_PORT,
        'metricsServer' : process.env.STATSD_METRIC_SERVER,
        'metricsService': process.env.STATSD_METRIC_SERVICE + '.' + require('os').hostname().split('.')[0],
        'debug'         : process.env.STATSD_DEBUG_MODE
    },
    'nodeCacheConfig': {
        'recordTTL'  : process.env.NODE_CACHE_RECORD_TTL,
        'checkPeriod': process.env.NODE_CACHE_CHECK_PERIOD
    },
    'aws': {
        's3': {
            'region'     : process.env.S3_REGION,
            'accessId'   : process.env.S3_ACCESS_KEY_ID,
            'secret'     : process.env.S3_SECRET_ACCESS_KEY,
            'bucket'     : process.env.S3_BUCKET_NAME,
            'baseDir'    : process.env.S3_LOCATION,
            'versionPath': process.env.S3_DATA_RELEASE_PATH,
            'bucketUrl'  : process.env.S3_BUCKET_URL
        }
    }
};

module.exports = config;