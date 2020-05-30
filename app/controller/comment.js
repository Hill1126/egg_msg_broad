'use strict';

const Controller = require('egg').Controller;


class CommentController extends Controller{
  
  /**
   * 在body中获取参数，新建一条评论
   * @returns {Promise<void>}
   */
  async new(){
    //获取当前用户信息
    const {ctx,service} = this;
    const user = ctx.session.user;
    
    
    
    
    
    
  }
  
}
