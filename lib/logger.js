// Copyright 2017 caicloud authors. All rights reserved.

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const nodeFormat = printf(info => {
  return `${info.timestamp} [${info.level}]: ${info.message}`;
});

const logger = createLogger({
  format: combine(timestamp(), nodeFormat),
  transports: [new transports.Console()]
});

module.exports = logger;
