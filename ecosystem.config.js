module.exports = {
    apps: [{
        name: 'express-api',
        script: './bin/www',
        env: {
            NODE_ENV: 'development'
        },
        env_staging: {
            NODE_ENV: 'staging'
        },
        env_production: {
            NODE_ENV: 'production'
        },
        instances: 3,
        exec_mode: 'cluster',
        kill_timeout: 5000
    }]
};