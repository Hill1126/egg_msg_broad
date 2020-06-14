'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  async createUser(userInfo) {
    const { ctx } = this;
    return ctx.model.User.create(userInfo);
  }

  async getUserBaseInfo(account) {
    const { ctx } = this;
    const userBase = await ctx.model.User.findOne({ account },
      {
        _id: 1,
        account: 1,
        name: 1,
        avatar: 1,
      }
    ).lean();
    return userBase;

  }

  async editUserInfo(userInfo) {
    const { ctx } = this;
    const result = await ctx.model.User.findOneAndUpdate({ _id: userInfo._id }, userInfo, { new: true });
    return result;

  }

  /**
   * 验证账号密码返回登录用户
   * @param {Object} value 参数体
   * @param {String} value.account 账号
   * @param {String} value.password 密码
   * @return {Promise<*>}
   */
  async loginByAccount(value) {
    const { ctx } = this;
    const user = await ctx.model.User.findOne(value, { password: 0 }).lean();
    if (!user) {
      ctx.throw(400, '账号或密码错误');
    }
    return user;
  }


}

module.exports = UserService;
