'use strict';

/** @type Egg.EggPlugin */
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
};

/**
 * restful项目工具
 * @type {{package: string, enable: boolean}}
 */
exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

/**
 * egg-mongodb支持
 * @type {{package: string, enable: boolean}}
 */
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

