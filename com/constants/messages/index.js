
const db = "DB.";

module.exports = {
    statsd: {
        // Note: All values should be a single string without any spaces or special characters
        healthcheck: {
            unhealthy: 'HEALTH_CHECK.UNHEALTHY'
        },
        exception: {
            status: 'STATUS'
        },
        db: {
            execQueryError    : db + "SQL_QUERY_ERROR",
            createClusterError: db + "SQL_CLUSTER_CONNECTION_ERROR",
            closeClusterError : db + "SQL_CLUSTER_CONNECTION_ERROR",
            getConnectionError: db + "SQL_GET_CONNECTION_ERROR"
        }
    },
    error: {
        internal         : "Internal Server Error",
        unauthorized     : "Unauthorized Request",
        invalidQueryParam: "Invalid request. Insufficient query parameters",
        db               : {
            getConnection          : "Error in getting connection from pool",
            execQuery              : "Error in query execution",
            createClusterConnection: "Unable to create cluster connection",
            maxRetryQueryDone      : "Max Retries for queries are done. Aborting query. "
        },
    },
    info: {
        db: {
            getConnection          : "Successfully received connection from pool.",
            createClusterConnection: "Successfully connected to DB cluster",
            closeClusterConnection : "Closed MySQL cluster connection"
        },
    },
    debug: {
        db: {
            retryDeadlock: "Deadlock detected while querying, Retrying query:"
        }
    },
    api: {

    }
}