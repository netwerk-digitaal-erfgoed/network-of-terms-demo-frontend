'use strict';

const Helpers = require('./helpers');

const internals = {};

internals.registerPlugin = async function (server, options) {

    server.views(Helpers.getViewConfig());

    const routes = [
        {
            method: 'GET',
            path: '/termennetwerk/faq',
            handler: (request, h) => h.redirect('/termennetwerk/nl/faq').permanent()
        },
        {
            method: 'GET',
            path: '/termennetwerk/{languageCode}/faq',
            options: internals.faq
        }
    ];

    server.route(routes);
};

exports.plugin = {
    name: 'content',
    register: internals.registerPlugin
};

internals.faq = {
    handler: async function (request, h) {

        const data = {
            pageTitle: request.i18n.__('faq.title'),
            navFaqActive: true
        };

        return h.view('faq', data);
    }
};
