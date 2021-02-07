const metrics = require('../../utilities/metrics.util'),
    messages = require('../../com/constants/messages/index');

exports.checkProcess = (healthObj = {}) => {
    return new Promise((resolve, reject) => {
        healthObj.ts = new Date();
        healthObj.pid = process.pid;
        healthObj.uptime = process.uptime();
        healthObj.memory = process.memoryUsage();
        if (healthObj.memory.heapTotal - healthObj.memory.heapUsed === 0) {
            // Out of heap memory
            healthObj.status = healthObj.status || 503;
            metrics.invoke('increment', messages.statsd.healthcheck.unhealthy);
            return reject(healthObj);
        }
        resolve(healthObj);
    });
}