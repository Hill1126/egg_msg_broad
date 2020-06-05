'use strict';


module.exports = () => {

  /**
   * 响应处理中间件
   */
  return async function responseHandler(ctx, next) {

    try {
      await next();
    } catch (e) {
      // 简单处理错误
      const res = {
        code: 1,
        msg: e.msg || e.message || '无错误说明',
      };
      ctx.body = res;
      return;
    }
    // 直接返回，用于静态资源响应
    if (ctx.body.sikp) {
      return ctx.body;
    }
    // 正常封装
    const res = {
      code: 0,
      data: ctx.body,
      msg: 'success',
    };
    if (ctx.status === 404) {
      res.msg = '接口未找到';
      res.code = 404;
    }
    ctx.body = res;
  };


};
