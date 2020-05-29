'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/service/user.test.js', () => {

  const value = {}
  //初始化，账号密码
  before(() =>{
    value.account = 'xjf';
    value.password = '123456';

  });
  
  it('should login success', async function() {
    const ctx = app.mockContext();
    const user = await ctx.service.user.loginByAccount(value);
    assert(user.account===value.account);

  });
  
  it('should login fail', async function () {
    const ctx = app.mockContext();
    value.password = 'wrong password'
    try {
      const user =await ctx.service.user.loginByAccount(value);
    }catch (e) {
      console.log(e);
      assert.equal(e.message,'账号或密码错误');
    }
    
  });

  
  
  
});
