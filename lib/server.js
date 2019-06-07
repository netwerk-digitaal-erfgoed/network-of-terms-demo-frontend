'use strict';

const Confidence = require('confidence');
const FsExtra = require('fs-extra');
const Glue = require('@hapi/glue');

const internals = {};

internals.run = async function () {

    const manifest = await FsExtra.readJson('configs/server.json');
    const store = new Confidence.Store();
    store.load(manifest);

    const filter = { env: process.env.NODE_ENV };
    const settings = store.get('/', filter);

    const composeOptions = { relativeTo: __dirname };
    const server = await Glue.compose(settings, composeOptions);

    await server.start();
};

internals.run().catch(console.error);
