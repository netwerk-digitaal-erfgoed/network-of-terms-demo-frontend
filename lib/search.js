'use strict';

const SearchClient = require('./client');
const Helpers = require('./helpers');
const Joi = require('@hapi/joi');

const internals = {};

internals.schemas = {
    registerPlugin: {
        endpoint: Joi.any().required()
    },
    search: {
        query: Joi.object({
            q: Joi.string().trim().allow('').default(''),
            datasets: Joi.array().items(Joi.string().trim().allow('')).single().default([])
        }).options({ allowUnknown: true, stripUnknown: true })
    }
};

internals.registerPlugin = async function (server, options) {

    options = await Joi.validate(options, internals.schemas.registerPlugin);

    server.plugins.search = options;

    server.views(Helpers.getViewConfig());

    const routes = [
        {
            method: 'GET',
            path: '/',
            options: internals.search
        },
        {
            method: 'GET',
            path: '/termennetwerk',
            handler: (request, h) => h.redirect('/termennetwerk/nl' + request.url.search).permanent()
        },
        {
            method: 'GET',
            path: '/termennetwerk/{languageCode}',
            options: internals.search
        }
    ];

    server.route(routes);
};

exports.plugin = {
    name: 'search',
    register: internals.registerPlugin
};

internals.search = {
    validate: {
        failAction: (request, h, err) => err,
        query: internals.schemas.search.query
    },
    handler: async function (request, h) {

        let searchError;
        let resultSet = [];

        const pluginOptions = request.server.plugins.search;
        const client = new SearchClient(pluginOptions.endpoint);
        const availableDatasets = await client.getDatasets();
        const isSearchAction = (request.query.q.length > 0 && request.query.datasets.length > 0);

        if (isSearchAction) {
            const searchOptions = {
                q: request.query.q,
                datasets: request.query.datasets
            };

            try {
                resultSet = await client.search(searchOptions);
            }
            catch (err) {
                searchError = err;
            }
        }

        const data = {
            languageCode: request.params.languageCode,
            pageTitle: request.i18n.__('search.title'),
            navSearchActive: true,
            isSearchAction,
            datasets: availableDatasets,
            q: request.query.q,
            selectedDatasets: request.query.datasets,
            searchError,
            resultSet
        };

        return h.view('search', data);
    }
};
