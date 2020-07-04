'use strict';


const fs = require('fs');
const Controller = require('egg').Controller;

const path = require('path');
const sendToWormhole = require('stream-wormhole');

// 定义创建接口的请求参数规则
const createRule = {
  account: { type: 'string', required: true },
  password: { type: 'string', required: true },
};

const updateRule = {
  name: { type: 'string', required: false },
  introduction: { type: 'string', required: false },
};

class UserController extends Controller {

  async create() {
    const { ctx, service } = this;
    const obj = {};
    obj.password = ctx.request.body.password;
    obj.account = ctx.request.body.account;
    ctx.validate(createRule, ctx.request.body);
    try {
      await service.user.createUser(obj);
    } catch (e) {
      ctx.throw(400, '账号不能重复');
    }

    ctx.body = 'sucess';

  }

  /**
   * 根据用户账号 获取相关信息。
   * @return {Promise<void>}
   */
  async getByAccount() {
    const { ctx, service } = this;
    // 验证id是否存在
    const account = ctx.params.account;

    ctx.validate({ account: 'string' }, ctx.params);
    const baseUser = await service.user.getUserBaseInfo(account);
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
      account: ctx.Joi.string().required(),
      name: ctx.Joi.string(),
      introduction: ctx.Joi.string(),
    }, Object.assign(ctx.request.body, ctx.params));

    userInfo._id = ctx.session.user._id;

    ctx.body = await service.user.editUserInfo(userInfo);

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
