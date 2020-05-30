'use strict';

const util = require('util');

module.exports = () => {
  
  /**
   * 响应处理中间件
   */
  return async function responseHandler(ctx,next){
    
    try{
      
      await next();
    }catch (e) {
      //简单处理错误
      let res = {
        code : ctx.status,
        msg : '系统发生错误，信息为：'+e.msg,
      };
      ctx.response.body = res;
      
    }
    //直接返回，用于静态资源响应
    if (ctx.response.sikp){
       return ctx.response.body;
    }
    //正常封装
    let res = {
      code : ctx.status,
      data : ctx.body,
      msg : 'success',
    }
    ctx.response.body = res;
    
    
  }
  
  
  
  
  
  
  
}
