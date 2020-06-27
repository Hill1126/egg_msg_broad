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
    ctx.body = await ctx.service.comment.createComment(data);
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

    const res = await ctx.service.comment.listComments(data);
    // 不进行消息封装
    ctx._pure = true;
    await ctx.render('index.html', res);
  }

  async updateComment() {
    const { ctx } = this;
    const schema = {
      context: ctx.Joi.string().required(),
      id: ctx.Joi.string().required(),
    };
    // 进行参数校验
    const data = ctx.validate2(schema, Object.assign(ctx.request.body, ctx.params));
    ctx.body = await ctx.service.comment.updateComment(data);
  }


  async deleteComment() {
    const { ctx } = this;
    const id = ctx.validate2({ id: ctx.Joi.string().required() }, ctx.params);
    ctx.service.comment.deleteComment(id);
    ctx.body = 'success';
  }

  async createReply() {
    const { ctx } = this;
    const schema = {
      context: ctx.Joi.string().required(),
      toUser: ctx.Joi.string().required(),
      commentId: ctx.Joi.string().required(),
    };
    const data = ctx.validate2(schema, Object.assign(ctx.request.body, ctx.params));
    ctx.body = await ctx.service.comment.createReply(data);
  }

  async deleteReply() {
    const { ctx } = this;
    const schema = {
      id: ctx.Joi.string().required(),
      replyId: ctx.Joi.string().required(),
    };
    const data = ctx.validate2(schema, Object.assign(ctx.request.body, ctx.params));
    ctx.body = await ctx.service.comment.deleteReply(data);
  }


}

module.exports = CommentController;
