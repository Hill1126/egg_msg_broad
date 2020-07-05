'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const supertest = require('supertest');

describe('test/app/controller/auth.test.js', () => {

  let agent;
  const user = {
    account: 'test',
    password: '123456',
  };

  before(() => {
    agent = supertest.agent(app.server);
  });

  it('should register success', async function() {
    await app.httpRequest()
      .post('/api/register')
      .send(user)
      .expect(200)
      .then(response => {
        assert(response.body.code === 0);
      });
  });

  it('should register fail', async function() {
    await app.httpRequest()
      .post('/api/register')
      .send(user)
      .then(response => {
        assert(response.body.code === 1);
      });
  });

  it('should login fail', async () => {
    await agent
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        account: user.account,
        password: 'worng_password',
      })
      .expect(200)
      .then(response => {
        assert(response.body.code === 1);
      });
  });

  it('should login success', async () => {
    await agent
      .post('/api/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(200);
  });

  it('should changePassword success', async () => {
    const url = `/api/user/${user.account}/password`;
    await agent
      .put(url)
      .send({
        newPass: '123',
        oldPass: '123456',
      }).expect(200);
  });

  it('should changePassword fail', async () => {
    const url = `/api/user/${user.account}/password`;
    await agent
      .put(url)
      .send({
        newPass: '123',
        oldPass: 'worng_password',
      })
      .expect(200)
      .then(response => {
        assert(response.body.code === 1);
      });
  });

  it('should login out success', async () => {
    const url = '/api/exit';
    await agent
      .get(url)
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
