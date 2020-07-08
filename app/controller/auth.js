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
    const user = await service.user.loginByAccount(data);
    user.password = null;
    // 存入session
    ctx.session.user = user;
    ctx.body = user;
  }

  async register() {
    const { ctx, service } = this;
    const obj = ctx.validate2({
      account: ctx.Joi.string().required(),
      password: ctx.Joi.string().required(),
    }, ctx.request.body);
    try {
      ctx.body = await service.user.createUser(obj);
    } catch (e) {
      ctx.throw(400, '账号不能重复');
    }
  }

  async changePassword() {
    const { ctx } = this;
    const data = ctx.validate2({
      newPass: ctx.Joi.string().required(),
      oldPass: ctx.Joi.string().required(),
      account: ctx.Joi.string().required(),
    }, Object.assign(ctx.request.body, ctx.params, ctx.query));

    await ctx.service.user.changePassword(data);
    ctx.body = '修改成功';
  }

  async logout() {
    // 删除用户session
    const { ctx } = this;
    ctx.session.user = null;
    ctx.body = 'success';
  }

}

module.exports = AuthController;
