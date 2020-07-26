'use strict';

const Controller = require('egg').Controller;


class CommentController extends Controller {

  /**
   * 在body中获取参数，新建一条评论
   * @return {Promise<void>}
   */
  async createComment() {

    const { ctx } = this;
    const schema = {
      context: ctx.Joi.string().required().max(512),
    };
    // 进行参数校验
    const data = ctx.validate2(schema, ctx.request.body);
    if (!data.context.trim()) ctx.throw(400, '留言不能全空格');
    // 包装留言板对象
    ctx.body = await ctx.service.comment.createComment(data);
  }

  /**
   * 根据id获取留言数据
   * @return {Promise<*>}
   */
  async getComment() {
    const { ctx } = this;
    const data = ctx.validate2({ id: ctx.Joi.string().required() }, ctx.params);
    ctx.body = await ctx.service.comment.getComment(data.id);
  }

  async listComments() {
    const { ctx } = this;
    const data = ctx.validate2({
      pageSize: ctx.Joi.number().integer().default(5),
      pageNum: ctx.Joi.number().integer().default(1),
      search: ctx.Joi.string().trim().default('')
        .max(10),
    }, Object.assign(ctx.params, ctx.query));

    ctx.body = await ctx.service.comment.listComments(data);
  }

  async listMyComments() {
    const { ctx } = this;
    const data = ctx.validate2({
      pageSize: ctx.Joi.number().integer().default(5),
      pageNum: ctx.Joi.number().integer().default(1),
      search: ctx.Joi.string().trim().default('')
        .max(10),
    }, Object.assign(ctx.params, ctx.query));
    data.account = ctx.session.user.account;
    const res = await ctx.service.comment.listComments(data);
    ctx.body = res;
  }

  async updateComment() {
    const { ctx } = this;
    const schema = {
      context: ctx.Joi.string().required().max(512),
      id: ctx.Joi.string().required(),
    };
    // 进行参数校验
    const data = ctx.validate2(schema, Object.assign(ctx.request.body, ctx.params));
    if (!data.context.trim()) ctx.throw(400, '留言不能全空格');
    const result = await ctx.service.comment.updateComment(data);
    ctx.body = 'ok';
  }


  async deleteComment() {
    const { ctx } = this;
    const data = ctx.validate2({ id: ctx.Joi.string().required() }, ctx.params);
    await ctx.service.comment.deleteComment(data.id);
    ctx.body = 'success';
  }

  async createReply() {
    const { ctx } = this;
    const schema = {
      context: ctx.Joi.string().trim().required()
        .max(512),
      toUser: ctx.Joi.string().required(),
      commentId: ctx.Joi.string().required(),
    };
    const data = ctx.validate2(schema, Object.assign(ctx.request.body, ctx.params));
    ctx.body = await ctx.service.comment.createReply(data);
  }

  async deleteReply() {
    const { ctx } = this;
    const schema = {
      commentId: ctx.Joi.string().required(),
      replyId: ctx.Joi.string().required(),
    };
    const data = ctx.validate2(schema, Object.assign(ctx.request.body, ctx.params));
    await ctx.service.comment.deleteReply(data);
    ctx.body = 'ok';
  }


  async updateReply() {
    const { ctx } = this;

    const schema = {
      context: ctx.Joi.string().required().max(512),
      replyId: ctx.Joi.string().required(),
      commentId: ctx.Joi.string().required(),
    };
    const data = ctx.validate2(schema, Object.assign(ctx.request.body, ctx.params));
    await ctx.service.comment.updateReply(data);
    ctx.body = 'ok';
  }

}

module.exports = CommentController;
