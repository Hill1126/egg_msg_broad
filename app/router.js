'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const loginChecker = app.middleware.loginChecker();

  // 用户相关
  router.get('/api/user/:account', controller.user.get);
  router.put('/api/user/:account', loginChecker, controller.user.update);
  router.post('/api/user/avatar', loginChecker, controller.user.updateAvatar);

  // 账号登录相关
  router.post('/api/login', controller.auth.login);
  router.get('/api/exit', loginChecker, controller.auth.logout);
  router.post('/api/register', controller.user.create);

  // 留言板相关
  router.post('/api/comment', loginChecker, controller.comment.createComment);
  router.get('/api/comment', controller.comment.listComments);
  router.get('/api/comment/:id', controller.comment.getComment);
  router.put('/api/comment/:id', loginChecker, controller.comment.updateComment);
  router.delete('/api/comment/:id', loginChecker, controller.comment.deleteComment);

};

