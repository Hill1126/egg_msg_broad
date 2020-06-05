'use strict';

const Controller = require('egg').Controller;


class CommentController extends Controller {

  /**
   * 在body中获取参数，新建一条评论
   * @return {Promise<void>}
   */
  async createComment() {
    // 获取当前用户信息
    const { ctx } = this;
    const user = ctx.session.user;

    const schema = {
      context: ctx.Joi.string().required(),
    };
    // 进行参数校验
    const data = ctx.validate2(schema, ctx.request.body);
    data.creator = user._id;
    // 包装留言板对象
    ctx.body = ctx.service.comment.createComment(data);
  }

  /**
   * 根据id获取留言数据
   * @return {Promise<*>}
   */
  async getComment() {
    const { ctx } = this;
    const id = ctx.validate2({ id: ctx.Joi.string().required() }, ctx.params);
    ctx.body = await ctx.service.comment.getComment(id);
  }

  async listComments() {
    const { ctx } = this;
    const data = ctx.validate2({
      pageSize: ctx.Joi.number().integer().default(10),
      pageNum: ctx.Joi.number().integer().default(1),
      search: ctx.Joi.string().default(''),
    }, ctx.request.body);

    ctx.body = await ctx.service.comment.listComments(data);
  }

  async deleteComment() {
    const { ctx } = this;
    const id = ctx.validate2({ id: ctx.Joi.string().required() }, ctx.params);
    ctx.body = await ctx.service.comment.deleteComment(id);
  }

}

module.exports = CommentController;
