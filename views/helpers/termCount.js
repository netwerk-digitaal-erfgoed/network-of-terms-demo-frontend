'use strict';

exports.termCount = function (termCount, context) {

    return context.data.root.__n('search.termsFound', termCount);
};
