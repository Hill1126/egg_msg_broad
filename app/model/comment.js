'use strict';

module.exports = app => {

  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;


  /**
   * 设定二级留言板模型
   */
  const replyCommentSchema = new Schema({
    createUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    toUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    context: { type: String, default: '' },
    createTime: { type: Date, default: Date.now() },
    isDel: { type: Boolean, default: false },
  });

  /**
   * 留言板模型
   */
  const CommentSchema = new Schema({
    creator: {
      type: Schema.ObjectId,
      ref: 'User',
      index: true,
    },
    context: {
      type: String,
      default: '',
      index: true,
    },
    createTime: { type: Date, default: Date.now() },
    isDel: { type: Boolean, default: false },
    replies: {
      type: [ replyCommentSchema ],
      default: [],
    },
  }, {
    collection: 'Comment',
  });

  return mongoose.model('Comment', CommentSchema);
};
