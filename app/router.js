'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const loginChecker = app.middleware.loginChecker();

  // 用户相关
  router.get('/user/:account', controller.user.getByAccount);
  router.get('/api/user', loginChecker, controller.user.get);
  router.put('/api/user/:account', loginChecker, controller.user.update);
  router.post('/api/user/avatar', loginChecker, controller.user.updateAvatar);
  router.get('/user/:account/password', loginChecker, controller.user.passwordPage);

  // 账号登录相关
  router.post('/api/login', controller.auth.login);
  router.get('/api/exit', loginChecker, controller.auth.logout);
  router.post('/api/register', controller.user.create);
  router.put('/api/user/:account/password', loginChecker, controller.auth.changePassword);

  // 留言板相关
  router.post('/api/comment', loginChecker, controller.comment.createComment);
  router.get('/comment', controller.comment.listComments);
  router.get('/api/comment/:id', controller.comment.getComment);
  router.put('/api/comment/:id', loginChecker, controller.comment.updateComment);
  router.delete('/api/comment/:id', loginChecker, controller.comment.deleteComment);

  router.get('/comment/:account', loginChecker, controller.comment.listMyComments);

  // 回复留言相关
  router.post('/api/reply/:commentId', loginChecker, controller.comment.createReply);
  router.delete('/api/reply/:commentId/:replyId', loginChecker, controller.comment.deleteReply);
  router.put('/api/reply/:commentId/:replyId', loginChecker, controller.comment.updateReply);

};

