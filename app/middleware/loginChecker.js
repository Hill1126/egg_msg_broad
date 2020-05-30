'use strict';

module.exports = options => {
  
  return async function loginCheck(ctx,next){
    if (ctx.session.user){
      return await next();
    }
    return ctx.throw(401,'请登录后操作');
  };
}
