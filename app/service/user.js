'use strict';

const Service = require('egg').Service;
const path = require('path');
const fs = require('fs');

class UserService extends Service {

  /**
   * 根据账号和密码创建用户。
   * @param {Object} userInfo
   * @param {string} userInfo.account
   * @param {string} userInfo.password
   * @return {Promise<any[]>}
   */
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
        introduction: 1,
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

  /**
   * 根据旧密码修改新密码
   * @param {Object} data
   * @param {string} data.newPass 输入的新密码
   * @param {string} data.oldPass  旧密码
   * @return {Promise<void>}
   */
  async changePassword(data) {
    const { ctx } = this;
    const { user } = ctx.session;
    const res = await ctx.model.User.findOne({
      account: user.account,
      password: data.oldPass,
    });
    if (!res) {
      ctx.throw('password,worng!');
    }
    res.password = data.newPass;
    res.save();
  }

  /**
   * 根据stream保存图片，更新用户头像地址
   * @param {object} stream 用户上传图片
   * @param {objectId} userId 用户id
   * @return {Promise<void>}
   */
  async updateAvatar(stream, userId) {

    const { ctx } = this;
    const url = await this.saveFile(stream);
    // 更新用户头像资料
    const userInfo = {
      _id: userId || ctx.session.user._id,
      avatar: url,
    };
    ctx.service.user.editUserInfo(userInfo).avatar;
    return url;
  }

  /**
   * 根据egg封装的stream保存到磁盘中。
   * @param stream mutilPartStream,egg封装过的stream
   * @return {Promise<string>}
   */
  async saveFile(stream) {
    // 判断文件后缀名
    const extname = path.extname(stream.filename).toLocaleLowerCase();
    // 设定写入的路径
    const filename = Date.now() + extname;
    const target = path.join(this.config.baseDir, 'app/public/avatar', filename);
    // 生成一个文件写入 文件流
    const writeStream = fs.createWriteStream(target);
    stream.pipe(writeStream);
    return '/avatar/' + filename;
  }


}

module.exports = UserService;
