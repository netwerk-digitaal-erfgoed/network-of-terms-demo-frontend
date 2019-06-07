'use strict';

const Hoek = require('@hapi/hoek');

exports.datasetKeyToName = function (datasetKey, context) {

    const datasets = Hoek.reach(context, 'data.root.datasets');

    if (datasets === undefined) {
        throw new Error('Missing datasets');
    }

    const dataset = datasets.find((dataset) => dataset.key === datasetKey);

    if (dataset === undefined) {
        throw new Error('Unknown dataset key: ' + datasetKey);
    }

    return dataset.name;
};
