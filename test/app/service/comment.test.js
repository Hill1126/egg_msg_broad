'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/service/comment.test.js', () => {

  const map = {};
  let ctx;

  before(async () => {
    ctx = app.mockContext();
    // 初始化用户
    map.testUser = await ctx.model.User.findOne({ account: 'test' });
    if (!map.testUser) {
      map.testUser = await ctx.model.User.create({ account: 'test', password: '123456' });
    }
    ctx.session.user = map.testUser;
  });

  it('should createComment success', async function() {

    map.comment = await ctx.service.comment.createComment({ context: '单元测试新增' });
  });

  // 留言展示部分
  it('should list comment with no key word and no account', async function() {
    ctx.session.user = map.testUser;
    const data = {
      pageSize: 5,
      pageNum: 1,
    };
    const res = await ctx.service.comment.listComments(data);
    assert(res);
  });

  it('should list comment with key but no account', async function() {
    ctx.session.user = map.testUser;
    const data = {
      pageSize: 5,
      pageNum: 1,
      search: '测试',
    };
    await ctx.service.comment.listComments(data);
  });

  it('should list comment with account but no key', async function() {
    const data = {
      pageSize: 5,
      pageNum: 1,
      account: 'test',
    };
    await ctx.service.comment.listComments(data);
  });

  it('should list comment with account and key', async function() {
    const data = {
      pageSize: 5,
      pageNum: 1,
      account: 'test',
      search: '测试',
    };
    const res = await ctx.service.comment.listComments(data);
    assert(res);
  });

  // 更新留言
  it('should update comment success', async function() {
    const res = await ctx.service.comment.updateComment({
      id: map.comment._id,
      context: '更新测试',
    });
    assert(res);
  });


  it('should create reply success', async function() {
    ctx.session.user = map.testUser;
    const res = await ctx.service.comment.createReply({
      commentId: String(map.comment._id),
      toUser: String(map.testUser._id),
      context: '回复测试',
    });
    map.comment = res;
    map.replyId = String(res.replies.pop()._id);
  });

  it('should update Reply success', async function() {

    await ctx.service.comment.updateReply({
      commentId: String(map.comment._id),
      replyId: map.replyId,
      context: '更新回复',
    });

  });

  it('should delete reply success', async function() {
    await ctx.service.comment.deleteReply({
      commentId: String(map.comment._id),
      replyId: map.replyId,
    });
  });

  it('should delete comment success', async function() {
    await ctx.service.comment.deleteComment(map.comment._id);
  });

  // 删除测试数据
  after(async () => {
    await Promise.all([
      // 删除用户
      ctx.model.User.findByIdAndDelete(map.testUser._id),
      // 删除留言
      ctx.model.Comment.findByIdAndDelete(map.comment._id),
    ]);

  });


});
