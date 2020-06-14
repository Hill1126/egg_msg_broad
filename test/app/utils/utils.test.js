'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('util test', () => {
  
  
  const obj = {};
  
  before(()=>{
    Object.assign(obj,data);
  });
  
  const data = {
    username: '1015599722',
    name: 'xujunfeng',
  }
  
  
  it('should Checker works fine', function () {
    const ctx = app.mockContext();
    let schema = {
      username : ctx.Joi.string().required(),
      password : ctx.Joi.string().min(5).required(),
      name     : ctx.Joi.string().default('22'),
    };
    try{
      ctx.validate2(schema,obj);
    } catch (e) {
      console.log(e);
      return;
    }
    assert.fail('校验工具失效')
    
  });
  
  it('should check pass', function () {
    const ctx = app.mockContext();
    obj.password = 'password';
    let schema = {
      username : ctx.Joi.string().required(),
      password : ctx.Joi.string().min(5).required(),
      name     : ctx.Joi.string().default('22'),
    };
    try{
      const value = ctx.validate2(schema,obj);
      assert(value);
    } catch (e) {
      assert.fail('校验发生错误:',e.msg);
      return;
    }
   
    
  });
  
  
  
});
