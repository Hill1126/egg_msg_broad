'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const supertest = require('supertest');


describe('test/app/controller/user.test.js', () => {

  let comment;
  let userInfo;
  let agent;
  const user = {
    account: 'test',
    password: '123456',
  };

  before(async () => {
    agent = supertest.agent(app.server);
    // 注册测试账号
    await app.httpRequest()
      .post('/api/register')
      .send(user)
      .then(response => {
        assert(response.body.code === 0);
        userInfo = response.body.data;
      });
    // 登录测试账号，保存cookie
    await agent
      .post('/api/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(200);
  });

  it('should get comment list success no keyword', async function() {
    await app.httpRequest()
      .get('/comment')
      .expect(200);
  });

  it('should get comment list success with  keyword', async function() {
    await app.httpRequest()
      .get('/comment')
      .send({
        search: 'test',
      })
      .expect(200);
  });

  it('should get user comment list success ', async function() {
    await agent
      .get(`/comment/${user.account}`)
      .expect(200);
  });

  it('should create comment  success ', async function() {
    await agent
      .post('/api/comment')
      .send({
        context: '新建留言测试',
      })
      .expect(200)
      .then(response => {
        // 保存留言信息
        assert(response.body.code === 0);
        comment = response.body.data;
      });
  });

  it('should update comment success', async function() {
    await agent
      .put(`/api/comment/${comment._id}`)
      .send({
        context: '更新留言测试',
      }).then(response => {
        assert(response.body.code === 0);
      });
  });

  it('should create comment reply success', async function() {
    await agent
      .post(`/api/reply/${comment._id}`)
      .send({
        context: '新增回复测试',
        toUser: userInfo._id,
      }).then(response => {
        assert(response.body.code === 0);
        // 更新留言，获取评论id
        comment = response.body.data;
      });
  });

  it('should update comment reply success', async function() {
    const reply = comment.replies.slice(-1);
    await agent
      .put(`/api/reply/${comment._id}/${reply.pop()._id}`)
      .send({
        context: '更新回复测试',
      }).then(response => {
        assert(response.body.code === 0);
      });
  });

  it('should delete comment reply success', async function() {
    const reply = comment.replies.slice(-1);
    await agent
      .delete(`/api/reply/${comment._id}/${reply.pop()._id}`)
      .then(response => {
        assert(response.body.code === 0);
      });
  });

  it('should delete comment success', async function() {
    await agent
      .delete(`/api/comment/${comment._id}`)
      .then(response => {
        assert(response.body.code === 0);
      });
  });


  // 删除测试账号
  after(async () => {
    const ctx = app.mockContext();
    await ctx.model.User.deleteOne({ account: user.account });
    await ctx.model.Comment.deleteOne({ _id: comment._id });
  });

});
