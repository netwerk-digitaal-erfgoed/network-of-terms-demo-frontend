Front end application for demonstrating NDE's Network of Terms
==============================

## Development

### Create .env file

    vi .env

Paste the contents underneath:

    NODE_ENV=development
    NOT_SERVER_URI=http://demo.netwerkdigitaalerfgoed.nl:8080/nde/graphql

### Build and start without Traefik

    docker-compose -f docker-compose.common.yml -f docker-compose.dev.yml build --no-cache
    docker-compose -f docker-compose.common.yml -f docker-compose.dev.yml up
    http://localhost:5401/

### Or build and start with Traefik

    docker-compose -f docker-compose.common.yml -f docker-compose.dev-traefik.yml build --no-cache
    docker-compose -f docker-compose.common.yml -f docker-compose.dev-traefik.yml up
    http://nde-demo.localhost/termennetwerk

### Logon to container

    docker-compose -f docker-compose.common.yml run --rm --no-deps --entrypoint /bin/bash server

### Or logon to running container

    docker exec -it -u root network-of-terms-demo-frontend_server_1 /bin/bash

### Coding conventions
https://hapijs.com/styleguide
