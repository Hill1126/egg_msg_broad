'use strict';

const Controller = require('egg').Controller;

const loginRule = {
  account: { type: 'string', required: true },
  password: { type: 'string', required: true },
};

class AuthController extends Controller {

  /**
   * 登录方法
   * @return {Promise<void>}
   */
  async login() {
    const { ctx, service } = this;
    // 参数校验
    ctx.validate(loginRule, ctx.request.body);
    const value = ctx.helper.buildObj(loginRule, ctx.request.body);
    // 登录校验
    let user ;
    try {
      user = await service.user.loginByAccount(value);
    }catch (e) {
      ctx.body = e.message;
      ctx.status = e.status;
      return;
    }
    // 存入session
    ctx.session.user = user;
    // 返回成功
    ctx.ok();
  }
  
  async logout(){
    //删除用户session
    const {ctx} = this;
    //
    ctx.session.user = null;
    ctx.ok();
    
  }
  
  
  

}

module.exports = AuthController;