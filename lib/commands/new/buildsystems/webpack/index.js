'use strict';

const ProjectItem = require('../../../../project-item').ProjectItem;

module.exports = function(project, options) {
  let model = project.model;

  const configurePlatform = require('./platforms');
  configurePlatform(project);

  let configureTranspiler = require(`./transpilers/${model.transpiler.id}`);
  configureTranspiler(project);

  let unitTestRunners = project.model.unitTestRunners;
  if (unitTestRunners) {
    for (let i = 0; i < unitTestRunners.length; i++) {
      let configureUnitTestRunner = require(`./unit-test-runners/${unitTestRunners[i].id}`);
      configureUnitTestRunner(project);
    }
  }

  if (model.integrationTestRunner) {
    let configureIntegrationTestRunner = require(`./integration-test-runner/${model.integrationTestRunner.id}`);
    configureIntegrationTestRunner(project);
  }

  let configureCSSProcessor = require(`./css-processors/${model.cssProcessor.id}`);
  configureCSSProcessor(project);

  let configureEditor = require(`./editors/${model.editor.id}`);
  configureEditor(project);

  project.addToSource(
    ProjectItem.resource('main.ext', 'src/main-webpack.ext', model.transpiler)
  ).addToTasks(
    ProjectItem.resource('build.ext', 'tasks/build-webpack.ext', project.model.transpiler),
    ProjectItem.resource('build.json', 'tasks/build.json'),
    ProjectItem.resource('run.ext', 'tasks/run-webpack.ext', project.model.transpiler),
    ProjectItem.resource('run.json', 'tasks/run-webpack.json'),
    ProjectItem.resource('environment.ext', 'tasks/environment.ext', project.model.transpiler)
  ).addToContent(
    ProjectItem.resource('index.ejs', 'content/index-webpack.ejs'),
    ProjectItem.resource('package-scripts.js', 'content/package-scripts.template.js')
      .asTemplate(normalizeForPreprocess(model)),
    ProjectItem.resource('static/favicon.ico', 'content/favicon.ico').binaryFile(),
    ProjectItem.resource('webpack.config.js', 'content/webpack.config.template.js')
      .asTemplate(model)
  ).addToDevDependencies(
    'gulp-rename',
    'html-webpack-plugin',
    'copy-webpack-plugin',
    'mini-css-extract-plugin',
    'aurelia-webpack-plugin',
    'duplicate-package-checker-webpack-plugin',
    'webpack',
    'webpack-cli',
    'webpack-dev-server',
    'expose-loader',
    'style-loader',
    'url-loader',
    'del',
    'css-loader',
    'nps',
    'nps-utils',
    'file-loader',
    'json-loader',
    'html-loader',
    'istanbul-instrumenter-loader',
    'opn',
    'webpack-bundle-analyzer'
  ).addToDependencies(
   'aurelia-polyfills'
  );

  project.package.engines = {
    'node': '>= 6.0.0'
  };

  project.package.scripts = {
    start: 'nps',
    test: 'nps test'
  };

  project.package.main = 'dist/app.bundle.js';
};

function normalizeForPreprocess(model) {
  function arrToObj(arr) {
    if (!arr) {
      return {};
    }
    if (!(arr instanceof Array)) {
      throw new Error(`Expected ${arr} to be an array`);
    }

    let obj = {};
    arr.map(x => obj[x.id] = x);
    return obj;
  }

  let result = {
    model: model,
    testRunners: arrToObj(model.unitTestRunners)
  };

  return result;
}
