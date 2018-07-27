// Copyright 2017 caicloud authors. All rights reserved.

const _ = require("lodash");
const moment = require("moment");
const gulp = require("gulp");
const plumber = require("gulp-plumber"); // less 文件编译报错不会中断 watch
const less = require("gulp-less"); // less 文件
const minifycss = require("gulp-minify-css"); // css 压缩
const fs = require("fs");
const logger = require("../lib/logger");

let verPath = "public";

const mod = {
  isDebug: function() {
    return process.env.NODE_ENV === "development";
  },

  buildConfig: function(nodeEnv) {
    const ver = moment().format("MMDDHHmmss");

    const online = {
      // 线上环境的时候，可以修改成 https://dn-caicloudui.qbox.me。
      // 同时 gulp 那边需要增加上传到七牛云的功能
      staticUrl: "/",
      staticVer: ver, // 静态资源的版本号
      port: 3000, // 端口
      cookieSecret: "c2a0i1c6l0o3u2d" // cookie加密
    };
    const dev = _.assign({}, online);
    dev.staticUrl = "/";
    if (nodeEnv === "development") {
      dev.staticVer = "build";
    }
    const o = this.isDebug() ? dev : online;
    fs.writeFileSync("../configs/runtime.json", JSON.stringify(o));
  }
};

/**
 * less文件转css
 */
gulp.task("less", function() {
  const list = [`../${verPath}/src/less/index.less`];
  return (gulp
      .src(list)
      // plumber 插件可以 catch less 的错误，让 watch 不会中断
      .pipe(
        plumber({
          errorHandler: function(err) {
            logger.error(err.message);
            logger.error(err.extract.join("\r\n"));
            this.emit("end");
          }
        })
      )
      .pipe(less())
      .pipe(gulp.dest(`../${verPath}/build/css/`)) );
});

/**
 * 拷贝img
 */
gulp.task("img", function() {
  const list = [`../${verPath}/src/img/**/*`];
  return gulp.src(list).pipe(gulp.dest(`../${verPath}/build/img/`));
});

/**
 * 开发阶段，监听 less 文件的变动。
 */
gulp.task("watch", function() {
  const list = [`../${verPath}/src/less/*.less`];
  mod.buildConfig("development");
  gulp.run("img");
  gulp.run("less");
  gulp.watch(list, ["less"]);
});

/**
 * 压缩CSS
 */
gulp.task("min_css", ["less"], function() {
  const dir = `../${verPath}/build/css/`;
  const arr = [`${dir}index.css`];

  return gulp
    .src(arr)
    .pipe(minifycss())
    .pipe(gulp.dest(`../${verPath}/build/css/`));
});

const minTaskList = ["min_css", "img"];

/**
 * 拷贝静态资源至版本文件夹
 */
gulp.task("copy", minTaskList, function() {
  const arr = [`../${verPath}/build/**/*`];
  const config = require("../configs/runtime.json");

  return gulp.src(arr).pipe(gulp.dest(`../${verPath}/${config.staticVer}`));
});

/**
 * gulp 默认任务。执行 production
 */
gulp.task("default", function() {
  mod.buildConfig("production");

  gulp.run("copy", function() {
    logger.info("*** done ***");
  });
});
