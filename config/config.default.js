/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */

// config/config.default.js
exports.keys = 'egg_msg_borad';
// 添加 view 配置
exports.view = {
  defaultViewEngine: 'nunjucks',
  mapping: {
    '.html': 'nunjucks',
  },
};
exports.news = {
  pageSize: 5,
  serverUrl: 'https://hacker-news.firebaseio.com/v0',
};

exports.mongoose = {
  url: ' mongodb://127.0.0.1:27017/msg_board',
  options: {
    autoIndex: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  // 加载到app上，默认开启
  app: true,
};

/**
 * 关闭csrf
 * @type {{xframe: {enable: boolean}}}
 */
exports.security = {
  csrf: {
    enable: false,
  },

};

exports.middleware = [
  'responseHandler',
];

exports.static = {
  prefix: '/',
};

exports.multipart = {
  mode: 'stream',
  fileSize: '10mb',
};

exports.salt = 'DO_NOT_CHANGE';
