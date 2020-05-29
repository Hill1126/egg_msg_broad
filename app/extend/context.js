'use strict';

module.exports = {
  
  async ok(data,code=200,msg= 'success'){
    let obj = {};
    obj.code = code;
    obj.data = data;
    obj.msg = msg;
    this.body = obj;
  },
  
  async fail(code=400,msg= 'request fail'){
    let obj = {};
    obj.code = code;
    obj.msg = msg;
    this.body = obj;
  }
  
};