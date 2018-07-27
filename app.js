// Copyright 2017 caicloud authors. All rights reserved.

const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const config = require("./configs/runtime.json");

const app = express();

app.set("views", path.join(__dirname, "public/ejs"));
app.set("view engine", "ejs");

app.use(helmet());
app.use(logger(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(require("express-domain-middleware"));

app.use((req, res, next) => {
  const staticUrl = config.staticUrl || "/";
  const staticVer = config.staticVer || "build";

  res.locals.G = {
    staticPath: `${staticUrl}${staticVer}`
  };

  next();
});

require("./routes")(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.send("ERROR");
});

module.exports = app;
