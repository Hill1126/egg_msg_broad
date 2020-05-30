'use strict';

const path = require('path');
const sendToWormhole = require('stream-wormhole');
const fs = require('fs');
const Controller = require('egg').Controller;

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
    obj.password = ctx.request.body.password ;
    obj.account = ctx.request.body.account ;
    ctx.validate(createRule, ctx.request.body);
    try {
      const user = await service.user.createUser(obj);
      if (user) {
        ctx.body = '创建成功';
        ctx.session.user = user;
      } else {
        ctx.body = '创建失败';
      }

    } catch (e) {
      ctx.body = '账号不能重复';
      ctx.status = 400;
      console.log(e);
    }
  }

  /**
   * 获取当前登录用户信息
   * @return {Promise<void>}
   */
  async get() {
    const { ctx, service } = this;
    // 验证id是否存在
    const account = ctx.params.account;

    ctx.validate({ account: 'string' }, ctx.params);
    const baseUser = await service.user.getUserBaseInfo(account);
    if (baseUser) {
      ctx.body = baseUser;
    } else {
      ctx.status = 404;
      ctx.body = '没有该用户';
    }
  }

  async update() {
    const { ctx, service } = this;
    // 校验需要更新的参数的值不为空
    ctx.validate(updateRule, ctx.request.body);

    // 获取数据,封装对象
    const userInfo = ctx.helper.buildObj(updateRule, ctx.request.body);
    userInfo._id = ctx.session.user._id;

    ctx.body = await service.user.editUserInfo(userInfo);

  }
  
  async updateAvatar(){
    const { ctx, service } = this;
    
      //文件流上传形式
      const stream = await ctx.getFileStream();
      //判断文件后缀名
      const extname =  path.extname(stream.filename).toLocaleLowerCase();
      //设定写入的路径
      let filename =  Date.now()+extname;
      const target = path.join(this.config.baseDir, 'app/public/avatar',filename);
      //生成一个文件写入 文件流
      const writeStream = fs.createWriteStream(target);
      stream.pipe(writeStream)
    
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
    //更新用户头像资料
    const userInfo = {
      _id:ctx.session.user._id,
      avatar : '/avatar/'+filename,
    }
    let path = ctx.service.user.editUserInfo(userInfo).avatar;
    ctx.ok(path);
  }
  

}

module.exports = UserController;
