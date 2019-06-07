#!/bin/bash

set -e

if [ -z $NODE_ENV ]; then
    echo "Error: missing environment variable 'NODE_ENV'"
    exit 1
fi

exec /usr/local/bin/supervisord -c /usr/src/app/configs/supervisor/${NODE_ENV}.conf
