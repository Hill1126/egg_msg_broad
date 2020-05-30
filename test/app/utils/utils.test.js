'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('util test', () => {
  
  
  
  const obj = {
    username: '1015599722',
    name: 'xujunfeng',
  }
  
  it('should Checker works fine', function () {
    try{
  
     const ctx = app.mockContext();
     
     
      const schema = {
        username : ctx.Joi.string().required(),
        password : ctx.Joi.string().min(5).required(),
        name     : ctx.Joi.string().default('22'),
      }
      
      ctx.helper.validate2(schema,obj);
    } catch (e) {
      console.log(e);
      return;
    }
    assert.fail('校验工具失效')
    
  });
  
});
