FROM node:14 as builder

COPY ./ /opt/service

RUN cd /opt/service && \
    yarn install --force && \
    yarn build && \
    cd /opt/service/dist && \
    yarn install --force

FROM node:14-alpine3.13

ARG UID=1001
ARG GID=1001

ENV TZ=Europe/Moscow

COPY --from=builder /opt/service/dist /opt/service

RUN adduser -u $UID -g $GID -s /bin/bash --disabled-password service-rest; \
    apk upgrade --update-cache; \
    apk add tzdata; \
    apk add bash; \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone; \
    rm -rf /tmp/* /var/cache/apk/*; \
    chown -R $UID:$GID /opt/service

USER $UID

CMD cd /opt/service && \
    yarn server
