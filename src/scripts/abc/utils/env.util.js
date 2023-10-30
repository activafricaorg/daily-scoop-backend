"use strict";
/**
 * Get application environment + env file to use
 * Author: https://github.com/omeiza
 */
if (!(process.env.NODE_ENV === 'production')) {
    console.log("Environment is ".concat(process.env.NODE_ENV));
    var path = ".env.".concat(process.env.NODE_ENV);
    require('dotenv').config({ path: __dirname + '/../../' + path });
}
