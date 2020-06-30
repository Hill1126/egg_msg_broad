'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const fs = require('fs');
const path = require('path');

describe('test/service/user.test.js', () => {

  const value = {};
  // 初始化，账号密码
  before(() => {
    value.account = 'test';
    value.password = '123456';

  });


  it('should create success', async function() {
    const ctx = app.mockContext();
    try {
      const user = await ctx.service.user.createUser({
        account: 'test',
        password: '123456',
      });
    } catch (e) {

    }
  });

  it('should login success', async function() {
    const ctx = app.mockContext();
    const user = await ctx.service.user.loginByAccount(value);
    assert(user.account === value.account);
  });

  it('should login fail', async function() {
    const ctx = app.mockContext();
    value.password = 'wrong password';
    try {
      await ctx.service.user.loginByAccount(value);
    } catch (e) {
      console.log(e);
      assert.equal(e.message, '账号或密码错误');
    }
  });

  it('should getUserBaseInfo', async function() {
    const ctx = app.mockContext();
    const account = 'test';
    const info = await ctx.service.user.getUserBaseInfo(account);
    assert(info);
  });

  it('should upload success', async function() {
    const ctx = app.mockContext();
    const readStream = fs.createReadStream(path.join(app.baseDir, 'app/public/image', 'avatar.png'));
    const url = await ctx.service.user.saveFile(readStream);
    assert(url);
  });


});
