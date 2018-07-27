#
# Copyright 2017 The Caicloud Authors.
#

FROM cargo.caicloudprivatetest.com/caicloud/node:8.9.4-slim
LABEL maintainer="xu-ai-liang"
WORKDIR /usr/app
COPY . /usr/app/
RUN npm config set registry=http://npm.caicloud.xyz/ && npm install && npm run build
CMD ["npm", "run", "start"]
