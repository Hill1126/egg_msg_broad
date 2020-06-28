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
   * 根据stream保存图片，更新用户头像地址
   * @param stream 用户上传图片
   * @returns {Promise<void>}
   */
  async updateAvatar(stream){
    // 判断文件后缀名
    const extname = path.extname(stream.filename).toLocaleLowerCase();
    // 设定写入的路径
    const filename = Date.now() + extname;
    const target = path.join(this.config.baseDir, 'app/public/avatar', filename);
    // 生成一个文件写入 文件流
    const writeStream = fs.createWriteStream(target);
    stream.pipe(writeStream);
  
    /*
    const file = ctx.request.files[0];
    let extname =path.extname(file.filename).toLocaleLowerCase();
    if ( (!extname.includes('jpg') && !extname.includes('png') )){
      ctx.fail(undefined,'请上传jpg、png格式的图片');
      return;
    }

    //设定写入的路径
    let filepath = path.join('/','avatar', Date.now()+extname)
    const target = path.join(this.config.baseDir, 'app/public/avatar',filepath);
    fs.writeFile(target,file,err =>{
      ctx.logger.error(err);
    });
    */
    // 更新用户头像资料
    const userInfo = {
      _id: ctx.session.user._id,
      avatar: '/avatar/' + filename,
    };
    let path = ctx.service.user.editUserInfo(userInfo).avatar;
  }


}

module.exports = UserService;
