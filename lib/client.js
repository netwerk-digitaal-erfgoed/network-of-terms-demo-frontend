'use strict';

const { request } = require('graphql-request');
const Cache = require('memory-cache');
const Joi = require('@hapi/joi');
const Wreck = require('@hapi/wreck');
const Xpath = require('xpath');
const XmlDom = require('xmldom');

const internals = {};

internals.schemas = {
    constructor: {
        baseUri: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
        datasetConfigUri: Joi.string().uri({ scheme: ['http', 'https'] }).required()
    },
    searchInput: Joi.object({
        q: Joi.string().required(),
        datasets: Joi.array().items(Joi.string()).min(1).required()
    }),
    searchResults: Joi.object({
        terms: Joi.array().items(Joi.object({
            dataset: Joi.string().required(),
            terms: Joi.array().items(Joi.alternatives().try(
                Joi.object({
                    uri: Joi.string().required(),
                    prefLabel: Joi.array().items(Joi.string().allow('')).required(),
                    scopeNote: Joi.array().items(Joi.string().allow('')).optional(),
                    altLabel: Joi.array().items(Joi.string().allow('')).optional(),
                    broader: Joi.array().items(Joi.string().allow('')).optional(),
                    narrower: Joi.array().items(Joi.string().allow('')).optional(),
                    related: Joi.array().items(Joi.object({
                        uri: Joi.string().allow('').optional(),
                        label: Joi.string().allow('', null).optional()
                    })).optional()
                }),
                Joi.any().valid(null)
            )).required()
        })).required()
    }).options({ allowUnknown: true })
};

exports = module.exports = internals.SearchClient = class {

    constructor(options) {

        this._options = Joi.attempt(options, internals.schemas.constructor);
    }

    async _getDatasets() {

        const response = await Wreck.get(this._options.datasetConfigUri);
        const xmlData = response.payload.toString();
        const document = new XmlDom.DOMParser().parseFromString(xmlData);
        const select = Xpath.useNamespaces({ 'nde': 'https://www.netwerkdigitaalerfgoed.nl/' });
        const nodes = select('//nde:dataset', document);

        const getDatasetsFromXml = (datasets, node) => {

            const attributes = select('@id', node);
            if (attributes.length !== 1 || attributes[0].nodeValue === undefined) {
                return;
            }

            const labels = select('nde:label/text()', node);
            if (labels.length !== 1 || labels[0].nodeValue === undefined) {
                return;
            }

            const dataset = {
                key: attributes[0].nodeValue,
                name: labels[0].nodeValue
            };

            datasets.push(dataset);

            return datasets;
        };

        const datasets = nodes.reduce(getDatasetsFromXml, []) || [];
        datasets.sort((datasetA, datasetB) => datasetA.name.localeCompare(datasetB.name));

        return datasets;
    }

    async getDatasets() {

        let datasets = Cache.get('datasets');

        if (datasets === null) {
            datasets = await this._getDatasets();
            Cache.put('datasets', datasets, 600000); // 10 minutes
        }

        return datasets;
    }

    async search(options) {

        options = await Joi.validate(options, internals.schemas.searchInput);

        const query = `query searchTerms($q: String! $datasets: [String!]!) {
            terms(match: $q dataset: $datasets) {
                dataset terms {
                    uri prefLabel scopeNote altLabel broader narrower related {
                        url label
                    }
                }
            }
        }`;

        const variables = {
            q: options.q,
            datasets: options.datasets
        }

        const results = await request(this._options.baseUri, query, variables);

        await Joi.validate(results, internals.schemas.searchResults);
        const resultSet = results.terms;

        // Certain datasets return 'null' rather than an empty set
        const transformNullToEmptySet = (dataset) => {

            if (dataset.terms[0] === null) {
                dataset.terms = [];
            }
        };

        resultSet.forEach(transformNullToEmptySet);

        return resultSet;
    }
};
