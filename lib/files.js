'use strict';

const internals = {};

internals.registerPlugin = function (server, options) {

    const routes = [
        {
            method: 'GET',
            path: '/termennetwerk/assets/{param*}',
            handler: {
                directory: {
                    path: 'assets'
                }
            }
        }
    ];

    server.route(routes);
};

exports.plugin = {
    name: 'files',
    register: internals.registerPlugin
};
