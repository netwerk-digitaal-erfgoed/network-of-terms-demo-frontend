FROM node:12.0.0

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN \
    # Install pip (https://pip.pypa.io/en/stable/installing/)
    curl -L https://bootstrap.pypa.io/get-pip.py | python &&\
    \
    # Install Supervisor
    pip install supervisor==4.0.2 &&\
    touch /var/run/supervisord.pid &&\
    mkdir -p /var/log/supervisor &&\
    \
    # Configure app
    mkdir -p /var/log/app &&\
    chown -R node /var/log/app &&\
    npm install

COPY . /usr/src/app
