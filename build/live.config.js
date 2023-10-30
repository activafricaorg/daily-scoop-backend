"use strict";
module.exports = {
    apps: [{
            name: 'scoop',
            script: './build/index.js',
            instances: 1,
            autorestart: true,
            watch: true,
            ignore_watch: ['.git'],
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'live',
            }
        }],
};
