FROM fluent/fluentd:edge-debian-armhf

USER 0

RUN apt-get -y update && apt-get -y install build-essential
RUN gem install fluent-plugin-mongo

USER fluent