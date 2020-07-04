'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const fs = require('fs');
const path = require('path');

describe('test/service/user.test.js', () => {

  const map = {};
  let ctx;
  const value = {
    account: 'test',
    password: '123456',
  };

  before(async () => {
    ctx = app.mockContext();
  });

  it('should create success', async function() {
    try {
      map.testUser = await ctx.service.user.createUser(value);
      ctx.session.user = map.testUser;
    } catch (e) {
      return;
    }
  });

  it('should login success', async function() {
    const user = await ctx.service.user.loginByAccount(value);
    assert(user.account === value.account);
  });

  it('should login fail', async function() {
    try {
      await ctx.service.user.loginByAccount({ account: 'test', password: 'worng_password' });
    } catch (e) {
      console.log(e);
      assert.equal(e.message, '账号或密码错误');
    }
  });

  it('should getUserBaseInfo', async function() {
    const info = await ctx.service.user.getUserBaseInfo(value.account);
    assert(info);
  });

  it('should editUserInfo success', async function() {
    const user = await ctx.model.User.findOne({ account: 'test' }, '_id');
    const userInfo = {
      name: '测试',
      _id: user._id,
    };
    await ctx.service.user.editUserInfo(userInfo);
  });

  it('should upload success', async function() {
    const readStream = fs.createReadStream(path.join(app.baseDir, 'app', 'public', 'image', 'avatar.png'));
    readStream.filename = 'test.png';
    const url = await ctx.service.user.saveFile(readStream);
    assert(url);
  });

  it('should update avatar success', async function() {
    // 上传图片
    const readStream = fs.createReadStream(path.join(app.baseDir, 'app', 'public', 'image', 'avatar.png'));
    readStream.filename = 'test.png';
    // 查找出test账号的id，
    const url = await ctx.service.user.updateAvatar(readStream, map.testUser._id);
    assert(url);

  });

  it('should changePassword success', async function() {
    await ctx.service.user.changePassword({
      oldPass: '123456',
      newPass: '123456',
    });
  });

  it('should changePassword fail', async function() {
    try {
      await ctx.service.user.changePassword({
        oldPass: 'worng pass',
        newPass: '123456',
      });
    } catch (e) {
      return;
    }
    assert.fail('登录应该失败');
  });

  // 删除测试数据
  after(async () => {
    await Promise.all([
      // 删除用户
      ctx.model.User.findByIdAndDelete(map.testUser._id),
    ]);

  });


});
