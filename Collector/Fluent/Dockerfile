FROM fluent/fluentd:v1.11-armhf-debian

USER 0

RUN apt-get -y update && apt-get -y install build-essential
RUN gem install fluent-plugin-mongo

USER fluent