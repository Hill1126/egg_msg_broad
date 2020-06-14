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

/**
 * egg-mongodb支持
 * @type {{package: string, enable: boolean}}
 */
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

