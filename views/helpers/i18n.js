'use strict';

const I18n = require('i18n');

exports.i18n = function (key, context) {

    // https://github.com/mashpie/i18n-node/issues/122
    this.locale = this.locale || context.data.root.locale;

    return I18n.__.apply(this, arguments);
};
