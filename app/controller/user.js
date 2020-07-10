'use strict';

const Controller = require('egg').Controller;


class UserController extends Controller {

  /**
   * 根据用户账号 获取相关信息。
   * @return {Promise<void>}
   */
  async getByAccount() {
    const { ctx, service } = this;

    const data = ctx.validate2({ account: ctx.Joi.string().trim().required() }, ctx.params);
    const baseUser = await service.user.getUserBaseInfo(data.account);
    if (baseUser) {
      ctx._pure = true;
      await this.ctx.render('user.html', baseUser);
    } else {
      ctx.throw('用户信息未找到', 400);
    }
  }

  /**
   * 获取当前登录用户信息
   * @return {Promise<void>}
   */
  async get() {
    const { ctx, service } = this;
    const account = ctx.session.user.account;
    ctx.body = await service.user.getUserBaseInfo(account);
  }

  async update() {
    const { ctx, service } = this;
    // 获取数据,封装对象
    const userInfo = ctx.validate2({
      account: ctx.Joi.string().trim().required(),
      name: ctx.Joi.trim().string().max(20),
      introduction: ctx.Joi.string().trim().max(256),
    }, Object.assign(ctx.request.body, ctx.params));

    userInfo._id = ctx.session.user._id;

    ctx.body = await service.user.editUserInfo(userInfo);

  }

  async pageHandler() {
    const { ctx } = this;
    if (ctx.session.user) {
      ctx.response.redirect('/comment');
    } else {
      ctx.response.redirect('/login.html');
    }
  }

  async updateAvatar() {
    const { ctx } = this;

    // 文件流上传形式
    const stream = await ctx.getFileStream();
    const url = await ctx.service.user.updateAvatar(stream, ctx.session.user._id);
    ctx.body = url;
  }

  async passwordPage() {
    this.ctx._pure = true;
    await this.ctx.render('changePass.html');
  }


}

module.exports = UserController;
