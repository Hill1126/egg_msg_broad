'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // 用户相关
  router.get('/user/:account', controller.user.get);
  router.put('/user/:account', controller.user.update);
  router.post('/user/avatar' , controller.user.updateAvatar);
  
  //账号登录相关
  router.post('/login',controller.auth.login);
  router.get('/exit',controller.auth.logout);
  router.post('/register',controller.user.create);
  
};

