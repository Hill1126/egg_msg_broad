'use strict';

module.exports = app => {

  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;


  const RoleSchema = new Schema({
    _id: false,
    isAdmin: { type: Boolean, default: false },
  });

  /**
     * 设定用户模型
     */
  const UserSchema = new Schema({
    name: { type: String, index: true, default: '留言板用户' + Math.random() * 100000 },
    avatar: { type: String, default: '/image/avatar.png' },
    account: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    createTime: { type: Date, default: Date.now() },
    introduction: { type: String, default: '此人很懒，什么都没有留下' },
    role: { type: RoleSchema, default: {} },

  }, {
    collection: 'User',
  });


  return mongoose.model('User', UserSchema);
};
