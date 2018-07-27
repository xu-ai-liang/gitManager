<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Node Project](#node-project)
  * [About the project](#about-the-project)
  * [Getting started](#getting-started)
    * [Layout](#layout)
  * [Technology](#technology)
  * [Format](#format)
  * [Start](#start)
  * [Pulish](#pulish)
  * [CMD](#cmd)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Node Project

## About the project

The template is used to create nodejs project. All nodejs projects must follow the conventions in the
template. Calling for exceptions must be brought up in the cweb team.

## Getting started

Below we describe the conventions or tools specific to golang project.

### Layout

```
├── .github
│   ├── ISSUE_TEMPLATE
│   └── PULL_REQUEST_TEMPLATE
├── CHANGELOG.md
├── CODEOWNERS
├── Jenkinsfile
├── Makefile
├── README.md
├── app.js
├── bin
│   └── www.js
├── build
│   └── node-project
│       └── Dockerfile
├── configs
│   ├── README.md
│   └── runtime.json
├── controllers
│   └── site.js
├── docs
│   └── README.md
├── gulp
│   └── build.js
├── i18n
│   └── index.js
├── lib
│   ├── logger.js
│   └── util.js
├── models
│   └── README.md
├── package.json
├── public
│   ├── ejs
│   │   └── index.ejs
│   └── src
│       ├── img
│       │   └── favicon.ico
│       ├── js
│       │   └── index.js
│       └── less
│           └── index.less
├── routes
│   └── index.js
├── scripts
│   ├── README.md
├── test
│   └── README.md
└── webpack
    ├── dev.js
    ├── dll.js
    └── prod.js
```

A brief description of the layout:

* `.github` has two template files for creating PR and issue. Please see the files for more details.
* `.gitignore` varies per project, but all projects need to ignore `node_modules` directory.
* `.babelrc` config of babel.
* `.eslintrc` config of eslint.
* `.eslintigore` config of eslintignore. ignore built files.
* `Makefile` is used to build the project.
* `Dockerfile` is used to build docker image.
* `CHANGELOG.md` contains auto-generated changelog information.
* `CODEOWNERS` contains owners of the project.
* `README.md` is a detailed description of the project.
* `build` dockerfile here
* `bin` only one file: www.js
* `app.js` index of the project
* `controllers` controller of nodejs
* `configs` runtime or other config
* `models` define models for database
* `docs` for project documentations.
* `lib` library for the project.
* `i18n` i18n for the project.
* `test` holds all tests (include unit tests).
* `public` for all static file, e.g. js, img, css.
* `routes` contains all route.
* `scripts` contains all .sh file
* `gulp` gulpfile here.
* `webpack` webpack config, contains dev and prod.

## Technology

* Nodejs v8
* Express v4
* Webpack v2
* Gulp
* EsLint
* Prettier

## Format

* EsLint, Prettier
* You can’t commit if there is any error in the staged files.

## Start

* npm run watch，support es6, react。
* it will build runtime.json in configs, when npm run watch or build
* start nodejs server
  * dev：npm run start:dev
  * online：npm run start
  * listen on port 3000

## Pulish

* make release VERSION=${TAG}

## CMD

* npm run watch
* npm run start:dev
* npm run watch:all
* npm run build
* npm run start
* make lint
* make doctoc
* make container VERSION=${TAG}
* make push VERSION=${TAG}
