// Copyright 2017 caicloud authors. All rights reserved.

const site = require("../controllers/site");

module.exports = app => {
  // 首页
  app.get("/", site.index);
};
