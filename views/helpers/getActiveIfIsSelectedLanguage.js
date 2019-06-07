'use strict';

const Hoek = require('@hapi/hoek');

exports.getActiveIfIsSelectedLanguage = function (languageCode, context) {

    const locale = Hoek.reach(context, 'data.root.locale');
    const isActive = (languageCode === locale);

    return (isActive) ? ' active' : '';
};
