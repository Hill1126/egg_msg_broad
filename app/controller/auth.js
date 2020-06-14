'use strict';

const Controller = require('egg').Controller;


class AuthController extends Controller {

  /**
   * 登录方法
   * @return {Promise<void>}
   */
  async login() {
    const { ctx, service } = this;
    // 参数校验
    const data = ctx.validate2({
      account: ctx.Joi.string().required(),
      password: ctx.Joi.string().required(),
    }, ctx.request.body);

    // 登录校验
    let user;
    try {
      user = await service.user.loginByAccount(data);
    } catch (e) {
      ctx.body = e.message;
      ctx.status = e.status;
      return;
    }
    // 存入session
    ctx.session.user = user;
    ctx.body = user;
  }

  async logout() {
    // 删除用户session
    const { ctx } = this;
    //
    ctx.session.user = null;

  }


}

module.exports = AuthController;
