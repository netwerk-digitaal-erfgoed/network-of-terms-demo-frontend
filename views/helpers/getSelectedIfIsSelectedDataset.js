'use strict';

const Hoek = require('@hapi/hoek');

exports.getSelectedIfIsSelectedDataset = function (datasetKey, context) {

    const datasets = Hoek.reach(context, 'data.root.selectedDatasets');

    if (datasets === undefined) {
        throw new Error('Missing datasets');
    }

    const isSelected = datasets.includes(datasetKey);

    return (isSelected) ? ' selected' : '';
};
