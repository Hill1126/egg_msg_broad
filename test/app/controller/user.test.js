'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const supertest = require('supertest');

const path = require('path');
const fs = require('fs');

describe('test/app/controller/user.test.js', () => {

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
      });
    // 登录测试账号，保存cookie
    await agent
      .post('/api/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(200);
  });

  it('should get user info success', async function() {
    await agent
      .get(`/user/${user.account}`)
      .expect(200);
  });

  it('should get user info fail', async function() {
    await agent
      .get('/user/not_exists_account')
      .expect(200)
      .then(response => {
        assert(response.body.code === 1);
      });
  });

  it('should user password page success', async function() {
    await agent
      .get(`/user/${user.account}/password`)
      .expect(200);
  });

  it('should get user success', async function() {
    await agent
      .get('/api/user')
      .expect(200)
      .then(response => {
        assert(response.body.code === 0);
      });
  });

  it('should update userInfo success', async function() {
    await agent
      .put(`/api/user/${user.account}`)
      .send({
        name: '测试用户更新',
      })
      .expect(200)
      .then(response => {
        assert(response.body.code === 0);
      });
  });

  it('should update avatar success', async function() {
    const avatar = fs.readFileSync(path.join(app.baseDir, 'app', 'public', 'image', 'avatar.png'));
    await agent
      .post('/api/user/avatar')
      .attach('avatar', avatar, 'avatar.png')
      .expect(200)
      .then(response => {
        assert(response.body.code === 0);
      });
  });

  // 删除测试账号
  after(async () => {
    const ctx = app.mockContext();
    await ctx.model.User.deleteOne({ account: user.account });
  });

});
