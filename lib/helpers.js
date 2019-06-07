'use strict';

const Handlebars = require('handlebars');

exports.getViewConfig = function () {

    const config = {
        engines: { html: Handlebars },
        relativeTo: __dirname,
        path: '../views',
        layout: true,
        layoutPath: '../views/layout',
        partialsPath: '../views/partials',
        helpersPath: '../views/helpers'
    };

    return config;
};
