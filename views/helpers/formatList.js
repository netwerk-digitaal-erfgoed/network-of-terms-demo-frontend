'use strict';

const Handlebars = require('handlebars');
const Hoek = require('@hapi/hoek');

exports.formatList = function (values) {

    const toElements = (value) => {

        if (typeof value === 'string') {
            return { label: value };
        }
        else {
            const label = Hoek.reach(value, 'label') || ''; // Can be "null"
            const uri = Hoek.reach(value, 'url');

            return { label, uri };
        }
    };

    const elements = values.map(toElements);
    elements.sort((valueA, valueB) => valueA.label.localeCompare(valueB.label));
    const separator = ' • ';

    const toString = (formatted, value) => {

        let str;
        if (value === undefined) {
            return formatted;
        }
        else if (value.uri !== undefined && !value.label) {
            str = Handlebars.escapeExpression(value.uri);
        }
        else if (value.uri !== undefined && value.label) {
            str = '<a href="' + Handlebars.escapeExpression(value.uri) + '">' + Handlebars.escapeExpression(value.label) + '</a>';
        }
        else {
            str = Handlebars.escapeExpression(value.label);
        }

        return formatted + str + separator;
    };

    let formatted = elements.reduce(toString, '');
    if (formatted.endsWith(separator)) {
        formatted = formatted.slice(0, -separator.length);
    }

    return new Handlebars.SafeString(formatted);
};
